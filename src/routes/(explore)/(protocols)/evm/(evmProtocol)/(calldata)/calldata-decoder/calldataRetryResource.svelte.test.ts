import { expect, test, vi } from 'vitest'

import { TanStackLiveQueryResource } from '$/lib/db/queryResource.svelte.ts'
import { CalldataRetryResource } from './calldataRetryResource.svelte.ts'
import { page } from 'vitest/browser'
import { render } from 'vitest-browser-svelte'
import Consumer from './CalldataRetryConsumer.svelte'
import { tick } from 'svelte'

const resource = () => new TanStackLiveQueryResource<{ value: string }>(() => ({
	data: undefined,
	isLoading: true,
	isError: false,
	isReady: false,
	status: 'loading',
}))

test('replaces a failed generation, guards duplicate retry, and ignores stale completion', async () => {
	const resources: TanStackLiveQueryResource<{ value: string }>[] = []
	const controller = new CalldataRetryResource(() => {
		const next = resource()
		resources.push(next)
		return next
	}, 'initial')
	const first = resources[0]

	first.fail('first failure')
	controller.retry()
	const second = resources[1]
	controller.retry()

	expect(resources).toHaveLength(2)
	expect(controller.retryPending).toBe(true)
	first.set({ value: 'stale success' })
	first.fail('stale failure')
	expect(controller.retryPending).toBe(true)

	second.set({ value: 'current success' })
	await Promise.resolve()
	expect(controller.retryPending).toBe(false)
	expect(controller.resource).toBe(second)
})

test('selector replacement creates a new generation and tears down the old subscription', () => {
	const first = resource()
	const second = resource()
	const firstSubscribe = vi.spyOn(first, 'subscribe')
	const firstUnsubscribe = vi.fn()
	firstSubscribe.mockReturnValue(firstUnsubscribe)
	let selected = first
	const controller = new CalldataRetryResource(() => selected, 'first')
	selected = second
	controller.setFactory(() => selected, 'second')

	expect(controller.resource).toBe(second)
	expect(firstSubscribe).toHaveBeenCalledOnce()
	controller.destroy()
	expect(firstUnsubscribe).toHaveBeenCalledOnce()
})

test('does not call the factory for a same-key replacement', () => {
	let calls = 0
	const controller = new CalldataRetryResource(() => {
		calls += 1
		return resource()
	}, 'same')

	controller.setFactory(() => {
		calls += 1
		return resource()
	}, 'same')

	expect(calls).toBe(1)
	controller.destroy()
})

test('replacement reaches a Svelte effect consumer', async () => {
	const controller = new CalldataRetryResource(() => resource(), 'consumer')
	const observed: unknown[] = []
	await render(Consumer, { controller, onObserve: (value) => observed.push(value) })
	await expect.element(page.getByLabelText('resource observation')).toHaveAttribute('data-resource', 'current')
	expect(observed).toHaveLength(1)
	controller.retry()
	await tick()
	expect(observed).toHaveLength(2)
	expect(observed[0]).not.toBe(observed[1])
	controller.destroy()
})
