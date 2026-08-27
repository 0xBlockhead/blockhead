import { expect, test } from 'vitest'

import { TanStackLiveQueryResource } from '$/lib/db/queryResource.svelte.ts'
import { CalldataRetryResource } from './calldataRetryResource.svelte.ts'
import { page } from 'vitest/browser'
import { render } from 'vitest-browser-svelte'
import Consumer from './CalldataRetryConsumer.svelte'
import { tick } from 'svelte'
import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'

const resource = (read: () => void = () => {}) => new TanStackLiveQueryResource<{ value: string }>(() => {
	read()
	return {
		data: undefined,
		isLoading: true,
		isError: false,
		isReady: false,
		status: 'loading',
	}
})

test.each(['success', 'failure'] as const)('settles retry after %s using only the declared SvelteKit resource contract', async (outcome) => {
	const started = Promise.withResolvers<void>()
	const source = resource(started.resolve)
	const portable: SvelteKitResource<{ value: string }> = {
		get current() { return source.current },
		get loading() { return source.loading },
		get ready() { return source.ready },
		get error() { return source.error },
		get then() { return source.then },
		get catch() { return source.catch },
		get finally() { return source.finally },
		[Symbol.toStringTag]: 'Resource',
	}
	const controller = new CalldataRetryResource(() => portable, 'portable')
	controller.retry()
	await started.promise
	if (outcome === 'success')
		source.set({ value: 'resolved' })
	else
		source.fail('failed retry')

	await expect.poll(() => controller.retryPending).toBe(false)
	expect(controller.resource).toBe(portable)
	controller.destroy()
	source.destroy()
})

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
	await expect.poll(() => controller.retryPending).toBe(false)
	expect(controller.resource).toBe(second)
})

test('selector replacement and destruction ignore obsolete completion', async () => {
	const firstStarted = Promise.withResolvers<void>()
	const secondStarted = Promise.withResolvers<void>()
	const first = resource(firstStarted.resolve)
	const second = resource(secondStarted.resolve)
	let selected = first
	const controller = new CalldataRetryResource(() => selected, 'first')
	controller.retry()
	selected = second
	controller.setFactory(() => selected, 'second')
	controller.retry()
	await Promise.all([firstStarted.promise, secondStarted.promise])
	first.set({ value: 'obsolete' })
	await first
	expect(controller.resource).toBe(second)
	expect(controller.retryPending).toBe(true)
	controller.destroy()
	second.set({ value: 'after destruction' })
	await second
	expect(controller.retryPending).toBe(true)
	first.destroy()
	second.destroy()
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
	const observed: SvelteKitResource<{ value: string }>[] = []
	await render(Consumer, { controller, onObserve: (value) => observed.push(value) })
	await expect.element(page.getByLabelText('resource observation')).toHaveAttribute('data-resource', 'current')
	expect(observed).toHaveLength(1)
	controller.retry()
	await tick()
	expect(observed).toHaveLength(2)
	expect(observed[0]).not.toBe(observed[1])
	controller.destroy()
})
