import { expect, it, onTestFinished } from 'vitest'
import { page } from 'vitest/browser'
import { render } from 'vitest-browser-svelte'
import { ProjectionResolution, entityFieldAddressKey } from '$/schema/$schema.ts'
import ProjectionBoundaryFixture from '$/routes/test/resource-boundary/projection-boundary-fixture.svelte'
import { createReferenceErrorFixture } from './client-reference-errors.fixture.ts'

it.each(['terminal facet', 'reference field'] as const)('propagates active %s failures despite another pending reference and recovers after removal', async (failureOwner) => {
	const { context, close } = createReferenceErrorFixture()
	onTestFinished(close)
	const children = context.select('MaterializationParent', { slug: 'parent' })
		.$$children({ sources: ['source-a'] })
	const path = failureOwner === 'terminal facet' ?
		children.Left
	:
		children.$sibling({ sources: ['source-a'] }).Left
	await render(ProjectionBoundaryFixture, { resource: path })
	await expect.poll(() => path.error).toBeDefined()
	await expect(path).rejects.toThrow('terminal child unavailable')
	await expect.element(page.getByRole('alert')).toHaveTextContent('terminal child unavailable')
	context.entityFieldCollections.MaterializationParent[
		entityFieldAddressKey('MaterializationParent', [], '$$children')
	].utils.replaceRows(() => true, [])
	await expect.poll(() => children.current?.values).toEqual([])
	await expect.poll(() => path.error).toBeUndefined()
	const recovered = await path
	expect(recovered.resolution).toBe(ProjectionResolution.Unsupported)
	await page.getByRole('button', { name: 'Retry' }).click()
	await expect.element(page.getByText('This section is unsupported for this entity.')).toBeInTheDocument()
	await expect.element(page.getByRole('alert')).not.toBeInTheDocument()
})
