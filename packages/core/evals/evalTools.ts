import 'dotenv/config'
import type { Score, Scorer } from 'autoevals'
import chalk from 'chalk'
import { db } from '@/db/db'
import { experiments, runs, sets, scores } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

type RunScore = {
  name: string
  score: number
}

type RunData = {
  input: string
  output: string
  expected?: string
  scores: RunScore[]
}

type SetData = {
  name: string
  score: number
  runs: RunData[]
}

type ExperimentData = {
  name: string
  description?: string
  sets: SetData[]
}

const calculateAvgScore = (runs: RunData[]): number => {
  if (runs.length === 0) return 0
  const totalScores = runs.reduce((sum, run) => {
    if (run.scores.length === 0) return sum
    const runAvg = run.scores.reduce((s, sc) => s + sc.score, 0) / run.scores.length
    return sum + runAvg
  }, 0)
  return totalScores / runs.length
}

export const loadExperiment = async (
  experimentName: string
) => {
  const experiment = await db.query.experiments.findFirst({
    where: eq(experiments.name, experimentName),
    with: {
      sets: {
        orderBy: [desc(sets.createdAt)],
        with: {
          runs: {
            with: {
              scores: true
            }
          }
        }
      }
    }
  })

  if (!experiment) return undefined

  const transformedSets: SetData[] = experiment.sets.map(set => ({
    name: set.name || '',
    score: set.score ?? 0,
    runs: set.runs.map(run => ({
      input: run.input,
      output: run.output || '',
      expected: run.expected || undefined,
      scores: run.scores.map(s => ({ name: s.name, score: s.score ?? 0 }))
    }))
  }))

  return {
    id: experiment.id,
    name: experiment.name,
    description: experiment.description || undefined,
    sets: transformedSets,
    createdAt: experiment.createdAt
  }
}

export const saveSet = async (
  experimentName: string,
  runsData: RunData[]
) => {
  const now = new Date()
  const score = calculateAvgScore(runsData)

  const existingExperiment = await db.query.experiments.findFirst({
    where: eq(experiments.name, experimentName)
  })

  let experimentId: number

  if (existingExperiment) {
    experimentId = existingExperiment.id
  } else {
    const result = await db.insert(experiments).values({
      name: experimentName,
      createdAt: now,
    })
    experimentId = Number(result.lastInsertRowid)
  }

  const setResult = await db.insert(sets).values({
    experimentId,
    score,
    createdAt: now,
  })
  const setId = Number(setResult.lastInsertRowid)

  for (const runData of runsData) {
    const runResult = await db.insert(runs).values({
      setId,
      input: runData.input,
      output: runData.output,
      expected: runData.expected,
      createdAt: now,
    })
    const runId = Number(runResult.lastInsertRowid)

    for (const scoreData of runData.scores) {
      await db.insert(scores).values({
        runId,
        name: scoreData.name,
        score: scoreData.score,
        createdAt: now,
      })
    }
  }
}

export const runEval = async <T = any>(
  experiment: string,
  {
    task,
    data,
    scorers,
  }: {
    task: (input: any) => Promise<T>
    data: { input: any; expected?: T; reference?: string | string[] }[]
    scorers: Scorer<T, any>[]
  }
) => {
  const results = await Promise.all(
    data.map(async ({ input, expected, reference }) => {
      const results = await task(input)
      let context: string | string[]
      let output: string

      if (results && typeof results === 'object' && 'context' in results) {
        context = (results as any).context
        output = (results as any).response
      } else {
        output = JSON.stringify(results)
      }

      const scoresResult: RunScore[] = await Promise.all(
        scorers.map(async (scorer) => {
          const score = await scorer({
            input,
            output: results,
            expected,
            reference,
            context,
          })
          return {
            name: score.name,
            score: score.score ?? 0,
          }
        })
      )

      const result: RunData = {
        input: typeof input === 'string' ? input : JSON.stringify(input),
        output,
        expected: expected ? JSON.stringify(expected) : undefined,
        scores: scoresResult,
      }

      return result
    })
  )

  const previousExperiment = await loadExperiment(experiment)
  const previousScore = previousExperiment?.sets[0]?.score || 0
  const currentScore = calculateAvgScore(results)
  const scoreDiff = currentScore - previousScore

  const color = previousExperiment
    ? scoreDiff > 0
      ? chalk.green
      : scoreDiff < 0
      ? chalk.red
      : chalk.blue
    : chalk.blue

  console.log(`Experiment: ${experiment}`)
  console.log(`Previous score: ${color(previousScore.toFixed(2))}`)
  console.log(`Current score: ${color(currentScore.toFixed(2))}`)
  console.log(
    `Difference: ${scoreDiff > 0 ? '+' : ''}${color(scoreDiff.toFixed(2))}`
  )
  console.log()

  await saveSet(experiment, results)

  return results
}