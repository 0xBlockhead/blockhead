import { page } from 'vitest/browser'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-svelte'

import { TanStackLiveQueryResource, type TanStackLiveQuerySnapshot } from '$/lib/db/queryResource.svelte.ts'
import ResourceBoundaryFixture from '$/routes/test/resource-boundary/resource-boundary-fixture.svelte'


test.each([false, true])('isolated direct=%s consumer follows notifications and preserves a cached resource across remount', async (direct) => {
	let snapshot: TanStackLiveQuerySnapshot<string> = {
		data: '',
		isLoading: true,
		isReady: false,
		isError: false,
		status: 'loading',
	}
	let publish = () => {}
	let subscriptions = 0
	let releases = 0
	const resource = new TanStackLiveQueryResource(() => snapshot, (update) => {
		subscriptions += 1
		publish = update
		return () => { releases += 1 }
	})
	const first = await render(ResourceBoundaryFixture, { resource, direct })
	if (direct)
		await expect.element(page.getByRole('status', { name: 'loading' })).toHaveTextContent('true')
	else
		await expect.element(page.getByLabelText('Loading…')).toBeInTheDocument()

	snapshot = { ...snapshot, data: 'Source one', isLoading: false, isReady: true, status: 'ready' }
	queueMicrotask(publish)
	await expect.element(page.getByText('Source one', { exact: true })).toBeInTheDocument()
	snapshot = { ...snapshot, data: 'Source two' }
	queueMicrotask(publish)
	await expect.element(page.getByText('Source two', { exact: true })).toBeInTheDocument()
	await expect.element(page.getByText('Source one', { exact: true })).not.toBeInTheDocument()
	expect(subscriptions).toBe(1)
	await first.unmount()
	await render(ResourceBoundaryFixture, { resource, direct })
	await expect.element(page.getByText('Source two', { exact: true })).toBeInTheDocument()
	expect(subscriptions).toBe(1)
	resource.destroy()
	resource.destroy()
	snapshot = { ...snapshot, data: 'Late source' }
	queueMicrotask(publish)
	await expect.element(page.getByText('Source two', { exact: true })).toBeInTheDocument()
	expect(releases).toBe(1)
})


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

test('renders subsequent source values and then a failure without losing retained data', async () => {
	let snapshot: TanStackLiveQuerySnapshot<string> = {
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

	const failure = new Error('later provider failure')
	snapshot = {
		...snapshot,
		isError: true,
		isReady: false,
		status: 'error',
		error: failure,
	}
	queueMicrotask(publish)
	await expect.element(page.getByRole('alert', { name: 'later provider failure' })).toHaveTextContent('Failed to load')
	expect(resource.current).toBe('Updated source value')
	expect(resource.ready).toBe(true)
	expect(resource.error).toBe(failure)
	resource.destroy()
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
