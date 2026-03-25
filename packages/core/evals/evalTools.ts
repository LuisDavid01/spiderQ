import 'dotenv/config'
import type { Score, Scorer } from 'autoevals'
import chalk from 'chalk'
import { db } from '@/db/db'
import { experiments, runs, sets } from '@/db/schema'
import { eq, type InferSelectModel } from 'drizzle-orm'

type Run = InferSelectModel<typeof runs>

type Set = InferSelectModel<typeof sets>


type Experiment = InferSelectModel<typeof experiments>




const calculateAvgScore = (runs: Run[]) => {
  const totalScores = runs.reduce((sum, run) => {
    const runAvg =
      run.scores.reduce((sum, score) => sum + score.score, 0) /
      run.scores.length
    return sum + runAvg
  }, 0)
  return totalScores / runs.length
}

export const loadExperiment = async (
  experimentName: string
): Promise<Experiment | undefined> => {
  const experiment = await db.query.experiments.findFirst({
	  where: eq(experiments.name, experimentName)
  })

  return experiment
}

export const saveSet = async (
  experimentName: string,
  runs: Omit<Run, 'createdAt'>[]
) => {

  const runsWithTimestamp = runs.map((run) => ({
    ...run,
    createdAt: new Date().toISOString(),
  }))

  const newSet = {
    runs: runsWithTimestamp,
    score: calculateAvgScore(runsWithTimestamp),
    createdAt: new Date().toISOString(),
  }

  const existingExperiment = db.query.experiments.findFirst({
	  where: eq(experiments.name, experimentName)
  })

  if (existingExperiment) {
    await db.update(experiments).set({ sets: [newSet] }).where(eq(experiments.id, existingExperiment.id))
  } else {
	  await db.insert(experiments).values({
		  name: experimentName,
		  sets: [newSet],
	  })
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

      if (results.context) {
        context = results.context
        output = results.response
      } else {
        output = results
      }

      const scores = await Promise.all(
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
            score: score.score,
          }
        })
      )

      const result = {
        input,
        output,
        expected,
        scores,
      }

      return result
    })
  )

  const previousExperiment = await loadExperiment(experiment)
  const previousScore =
    previousExperiment?.sets[previousExperiment.sets.length - 1]?.score || 0
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
