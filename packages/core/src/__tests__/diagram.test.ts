import { createDiagramLocal } from '@/tools/diagrams'
import { test, expect, describe } from 'vitest'

test('Create valid diagram', async () => {
	const diagramCode = `graph TD
	A[Start] --> B[Step 1]
	B --> C[Step 2]
	C --> D[Step 3]
	D --> E[Step 4]
	E --> A[End]`
	const result = await createDiagramLocal(diagramCode, 1)
	expect(result).toBe('diagram created correctly in user path .spiderq/diagrams/1.png')

}, 100000)


