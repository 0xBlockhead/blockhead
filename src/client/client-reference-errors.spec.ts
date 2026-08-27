import { expect, it, onTestFinished } from 'vitest'
import { createReferenceErrorFixture } from './client-reference-errors.fixture.ts'

it.each(['terminal facet', 'reference field'] as const)('rejects initial %s failures without waiting for an unrelated pending sibling in the server runtime', async (failureOwner) => {
	const { context, close } = createReferenceErrorFixture()
	onTestFinished(close)
	const children = context.select('MaterializationParent', { slug: 'parent' })
		.$$children({ sources: ['source-a'] })
	const path = failureOwner === 'terminal facet' ?
		children.Left
	:
		children.$sibling({ sources: ['source-a'] }).Left
	await expect(path.then()).rejects.toThrow('terminal child unavailable')
})
