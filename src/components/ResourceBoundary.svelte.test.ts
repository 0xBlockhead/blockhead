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

test('renders subsequent values from an asynchronous source notification', async () => {
	let snapshot = {
		data: 'Initial source value',
		isLoading: false,
		isError: false,
		isReady: true,
		status: 'ready',
	}
	let publish = () => {}
	const resource = new TanStackLiveQueryResource(
		() => snapshot,
		(update) => {
			publish = update
			return () => {}
		}
	)

	await render(ResourceBoundaryFixture, {
		resource,
	})

	await expect.element(page.getByText('Initial source value')).toBeInTheDocument()
	snapshot = {
		...snapshot,
		data: 'Updated source value',
	}
	queueMicrotask(publish)
	await expect.element(page.getByText('Updated source value')).toBeInTheDocument()
	await expect.element(page.getByText('Initial source value')).not.toBeInTheDocument()
})

test('renders an explicit default source failure without hiding its detail', async () => {
	const resource = new TanStackLiveQueryResource(() => ({
		data: undefined,
		error: new Error('provider unavailable'),
		isLoading: false,
		isError: true,
		isReady: false,
		status: 'error',
	}))

	await render(ResourceBoundaryFixture, {
		resource,
	})

	const failure = page.getByRole('alert', { name: 'provider unavailable' })
	await expect.element(failure).toHaveTextContent('Failed to load')
	expect(failure.element().getAttribute('title')).toBe('provider unavailable')
})
