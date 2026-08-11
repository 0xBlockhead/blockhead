import { page } from 'vitest/browser'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-svelte'

import Boundary from './Boundary.svelte'


test('names the error-details copy action distinctly', async () => {
	await render(Boundary, {
		boundaryKey: 'Test boundary',
		failure: {
			error: new Error('provider unavailable'),
		},
	})

	await expect.element(page.getByRole('alert')).toHaveTextContent('provider unavailable')
	await expect.element(page.getByRole('button', { name: 'Copy error details' })).toBeVisible()
})
