import { createRawSnippet } from 'svelte'
import { page } from 'vitest/browser'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-svelte'

import { ProjectionResolution } from '$/schema/$schema.ts'
import Projection from './Projection.svelte'


const applicable = createRawSnippet(() => ({
	render: () => '<p>Resolved value</p>',
}))


test('keeps blocked and unsupported projection states visible when a view omits custom copy', async () => {
	await render(Projection, {
		props: {
			projection: {
				resolution: ProjectionResolution.Blocked,
				dependencies: [],
			},
			Applicable: applicable,
		},
	})

	await expect.element(page.getByText('This section is waiting for required data.')).toBeInTheDocument()
	expect(page.getByText('This section is waiting for required data.').element().getAttribute('data-section-state')).toBe('blocked')

	await render(Projection, {
		props: {
			projection: {
				resolution: ProjectionResolution.Unsupported,
			},
			Applicable: applicable,
		},
	})

	await expect.element(page.getByText('This section is unsupported for this entity.')).toBeInTheDocument()
	expect(page.getByText('This section is unsupported for this entity.').element().getAttribute('data-section-state')).toBe('unsupported')
})


test('preserves a view-specific unsupported projection explanation', async () => {
	await render(Projection, {
		props: {
			projection: {
				resolution: ProjectionResolution.Unsupported,
			},
			Applicable: applicable,
			Unsupported: createRawSnippet(() => ({
				render: () => '<p>Native source does not provide this field.</p>',
			})),
		},
	})

	await expect.element(page.getByText('Native source does not provide this field.')).toBeInTheDocument()
	await expect.element(page.getByText('This section is unsupported for this entity.')).not.toBeInTheDocument()
})
