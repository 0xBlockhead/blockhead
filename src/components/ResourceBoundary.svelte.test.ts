import { page } from 'vitest/browser'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-svelte'

import { TanStackLiveQueryResource } from '$/lib/db/queryResource.svelte.ts'
import ResourceBoundaryFixture from '$/routes/test/resource-boundary/resource-boundary-fixture.svelte'


test('renders subsequent values from the resource-owned await state', async () => {
	const resource = new TanStackLiveQueryResource(() => ({
		data: 'Initial value',
		isLoading: false,
		isError: false,
		isReady: true,
		status: 'ready',
	}))

	await render(ResourceBoundaryFixture, {
		resource,
	})

	await expect.element(page.getByText('Initial value')).toBeInTheDocument()
	resource.set('Updated value')
	await expect.element(page.getByText('Updated value')).toBeInTheDocument()
	await expect.element(page.getByText('Initial value')).not.toBeInTheDocument()
})
