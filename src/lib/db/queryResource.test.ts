import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	type TanStackLiveQuerySnapshot,
	TanStackLiveQueryResource,
} from './queryResource.svelte.ts'


const loadingSnapshot = {
	data: undefined,
	isLoading: true,
	isError: false,
	isReady: false,
	status: 'loading',
} satisfies TanStackLiveQuerySnapshot<string | undefined>

const readySnapshot = (
	data: string
) => ({
	data,
	isLoading: false,
	isError: false,
	isReady: true,
	status: 'ready',
}) satisfies TanStackLiveQuerySnapshot<string>

const errorSnapshot = (
	error: string
) => ({
	data: '',
	isLoading: false,
	isError: true,
	isReady: false,
	error,
	status: 'error',
}) satisfies TanStackLiveQuerySnapshot<string>

const createFixture = (
	initialSnapshot: TanStackLiveQuerySnapshot<string | undefined> = loadingSnapshot,
	initialize: () => Promise<void> = () => Promise.resolve()
) => {
	let snapshot = initialSnapshot
	let queryCount = 0
	let sourceSubscriptionCount = 0
	const listeners = new Set<() => void>()
	const resource = new TanStackLiveQueryResource<string | undefined>(
		() => {
			queryCount += 1
			return snapshot
		},
		(update) => {
			sourceSubscriptionCount += 1
			listeners.add(update)
			return () => {
				sourceSubscriptionCount -= 1
				listeners.delete(update)
			}
		},
		initialize
	)

	return {
		resource,
		get queryCount() {
			return queryCount
		},
		get sourceSubscriptionCount() {
			return sourceSubscriptionCount
		},
		setSnapshot(nextSnapshot: TanStackLiveQuerySnapshot<string | undefined>) {
			snapshot = nextSnapshot
			for (const listener of listeners)
				listener()
		},
	}
}

describe('TanStackLiveQueryResource', () => {
	it.each(['success', 'failure'] as const)('awaits asynchronous finally cleanup after %s', async (outcome) => {
		const fixture = createFixture(outcome === 'success' ? readySnapshot('ready') : errorSnapshot('source failure'))
		const cleanup = Promise.withResolvers<void>()
		const entered = Promise.withResolvers<void>()
		let settled = false
		const result = fixture.resource.finally(() => {
			entered.resolve()
			return cleanup.promise
		}).then(
			(value) => {
				settled = true
				return value
			},
			(error) => {
				settled = true
				return String(error)
			}
		)
		await entered.promise
		await new Promise((resolve) => setTimeout(resolve, 0))
		expect(settled).toBe(false)
		cleanup.resolve()
		await expect(result).resolves.toBe(outcome === 'success' ? 'ready' : 'source failure')
		fixture.resource.destroy()
	})

	it.each(['success', 'failure'] as const)('lets rejected finally cleanup override %s', async (outcome) => {
		const fixture = createFixture(outcome === 'success' ? readySnapshot('ready') : errorSnapshot('source failure'))
		const cleanupFailure = new Error('cleanup failed')
		await expect(fixture.resource.finally(async () => {
			throw cleanupFailure
		})).rejects.toBe(cleanupFailure)
		fixture.resource.destroy()
	})

	it.each([undefined, null, false, 0, ''])('resolves valid falsey data %s without treating it as pending', async (data) => {
		const resource = new TanStackLiveQueryResource(() => ({
			data,
			isLoading: false,
			isReady: true,
			isError: false,
			status: 'ready',
		}))
		await expect(resource).resolves.toBe(data)
		expect(resource.current).toBe(data)
		expect(resource.ready).toBe(true)
		expect(resource.loading).toBe(false)
		resource.destroy()
	})

	it.each(['resolve', 'reject'] as const)('does not publish initialization %s after destruction', async (outcome) => {
		const initialization = Promise.withResolvers<void>()
		const started = Promise.withResolvers<void>()
		const fixture = createFixture(readySnapshot('late'), () => {
			started.resolve()
			return initialization.promise
		})
		void fixture.resource.current
		await started.promise
		fixture.resource.destroy()
		if (outcome === 'resolve')
			initialization.resolve()
		else
			initialization.reject(new Error('late failure'))

		await new Promise((resolve) => setTimeout(resolve, 0))
		expect(fixture.queryCount).toBe(0)
		expect(fixture.resource.current).toBeUndefined()
		expect(fixture.resource.error).toBeUndefined()
		expect(fixture.sourceSubscriptionCount).toBe(0)
	})

	it('does not start initialization after destruction during deferred startup', async () => {
		let initialized = false
		const fixture = createFixture(readySnapshot('unused'), () => {
			initialized = true
			return Promise.resolve()
		})
		void fixture.resource.current
		fixture.resource.destroy()
		await new Promise((resolve) => setTimeout(resolve, 0))
		expect(initialized).toBe(false)
		expect(fixture.queryCount).toBe(0)
	})

	it('lets authoritative source readiness settle independently of a pending bootstrap waiter', async () => {
		const initialization = Promise.withResolvers<void>()
		const started = Promise.withResolvers<void>()
		const fixture = createFixture(loadingSnapshot, () => {
			started.resolve()
			return initialization.promise
		})
		void fixture.resource.current
		await started.promise
		fixture.setSnapshot(readySnapshot('authoritative'))
		expect(fixture.resource.ready).toBe(true)
		expect(fixture.resource.current).toBe('authoritative')
		await expect(fixture.resource).resolves.toBe('authoritative')
		initialization.resolve()
		fixture.resource.destroy()
	})

	it('surfaces a throwing source snapshot through the resource error contract', async () => {
		const failure = new Error('invalid source projection')
		let fail = false
		let publish = () => {}
		const resource = new TanStackLiveQueryResource(() => {
			if (fail)
				throw failure

			return readySnapshot('last good')
		}, (update) => {
			publish = update
			return () => {}
		})
		await expect(resource).resolves.toBe('last good')
		fail = true
		expect(publish).not.toThrow()
		expect(resource.error).toBe(failure)
		expect(resource.current).toBe('last good')
		await expect(resource).rejects.toBe(failure)
		resource.destroy()
	})

	it('keeps plural direct getter and promise reads on one source subscription', async () => {
		let snapshot = {
			data: ['first'],
			isLoading: false,
			isError: false,
			isReady: true,
			status: 'ready',
		} satisfies TanStackLiveQuerySnapshot<string[]>
		let sourceSubscriptionCount = 0
		const listeners = new Set<() => void>()
		const resource = new TanStackLiveQueryResource(
			() => snapshot,
			(update) => {
				sourceSubscriptionCount += 1
				listeners.add(update)
				return () => {
					sourceSubscriptionCount -= 1
					listeners.delete(update)
				}
			}
		)

		expect(resource.current).toBeUndefined()
		await expect(resource).resolves.toEqual(['first'])
		expect(resource.current).toEqual(['first'])
		expect(sourceSubscriptionCount).toBe(1)

		snapshot = {
			...snapshot,
			data: [
				'first',
				'second',
			],
		}
		for (const listener of listeners)
			listener()

		expect(resource.current).toEqual([
			'first',
			'second',
		])
		await expect(resource).resolves.toEqual([
			'first',
			'second',
		])
		expect(sourceSubscriptionCount).toBe(1)
	})

	it('stays lazy until a getter or promise surface is observed', async () => {
		let initializationCount = 0
		const fixture = createFixture(readySnapshot('ready'), () => {
			initializationCount += 1
			return Promise.resolve()
		})

		expect(fixture.sourceSubscriptionCount).toBe(0)
		expect(initializationCount).toBe(0)
		expect(fixture.resource.current).toBeUndefined()
		expect(fixture.sourceSubscriptionCount).toBe(0)
		expect(initializationCount).toBe(0)
		await expect(fixture.resource).resolves.toBe('ready')
		expect(fixture.sourceSubscriptionCount).toBe(1)
		expect(initializationCount).toBe(1)
	})

	it('publishes one ready value through every getter', async () => {
		const fixture = createFixture()

		expect(fixture.resource.current).toBeUndefined()
		expect(fixture.resource.loading).toBe(true)
		expect(fixture.resource.ready).toBe(false)
		expect(fixture.resource.error).toBeUndefined()
		fixture.setSnapshot(readySnapshot('first'))
		await expect(fixture.resource).resolves.toBe('first')
		expect(fixture.resource.current).toBe('first')
		expect(fixture.resource.loading).toBe(false)
		expect(fixture.resource.ready).toBe(true)
		expect(fixture.resource.error).toBeUndefined()
	})

	it('does not reapply a snapshot from promise callbacks', async () => {
		const fixture = createFixture(readySnapshot('ready'))

		await expect(Promise.all([
			fixture.resource.then((value) => value),
			fixture.resource.then((value) => value),
		])).resolves.toEqual([
			'ready',
			'ready',
		])
		expect(fixture.queryCount).toBe(1)
	})

	it.each([
		{
			isLoading: true,
			isReady: true,
		},
		{
			isLoading: false,
			isReady: false,
		},
	])('keeps the last value while the source is pending: %j', async (flags) => {
		const fixture = createFixture(readySnapshot('first'))
		await expect(fixture.resource).resolves.toBe('first')

		fixture.setSnapshot({
			...loadingSnapshot,
			...flags,
			data: 'first',
		})
		expect(fixture.resource.current).toBe('first')
		expect(fixture.resource.loading).toBe(true)
		expect(fixture.resource.ready).toBe(true)
		expect(fixture.resource.error).toBeUndefined()
	})

	it('keeps getter and promise reads aligned across refreshes', async () => {
		const fixture = createFixture(readySnapshot('first'))
		await expect(fixture.resource).resolves.toBe('first')

		fixture.setSnapshot(readySnapshot('second'))
		expect(fixture.resource.current).toBe('second')
		await expect(fixture.resource).resolves.toBe('second')
	})

	it('retries a promise read when refresh replaces its pending state', async () => {
		const fixture = createFixture(readySnapshot('first'))
		await expect(fixture.resource).resolves.toBe('first')

		let settled = false
		const read = fixture.resource.then((value) => {
			settled = true
			return value
		})
		fixture.setSnapshot(loadingSnapshot)
		await Promise.resolve()
		await Promise.resolve()
		expect(settled).toBe(false)

		fixture.setSnapshot(readySnapshot('second'))
		await expect(read).resolves.toBe('second')
		expect(settled).toBe(true)
	})

	it('returns getter and promise surfaces to one pending state after authoritative deletion', async () => {
		const fixture = createFixture(readySnapshot('first'))
		await expect(fixture.resource).resolves.toBe('first')

		fixture.setSnapshot(loadingSnapshot)
		expect(fixture.resource.current).toBeUndefined()
		expect(fixture.resource.loading).toBe(true)
		expect(fixture.resource.ready).toBe(false)
		expect(fixture.resource.error).toBeUndefined()

		let settled = false
		const reloaded = fixture.resource.finally(() => {
			settled = true
		})
		void reloaded.catch(() => {})
		await new Promise((resolve) => setTimeout(resolve, 0))
		expect(settled).toBe(false)
		fixture.setSnapshot(readySnapshot('second'))
		await expect(reloaded).resolves.toBe('second')
		expect(fixture.resource.current).toBe('second')
		expect(fixture.resource.loading).toBe(false)
		expect(fixture.resource.ready).toBe(true)
	})

	it('rejects then, catch, and finally from the same failed state', async () => {
		const fixture = createFixture()
		let finallyCount = 0
		const thenResult = fixture.resource.then(undefined, (error) => String(error))
		const catchResult = fixture.resource.catch((error) => String(error))
		const finallyResult = fixture.resource.finally(() => {
			finallyCount += 1
		}).catch((error) => String(error))

		fixture.setSnapshot(errorSnapshot('failure'))
		await expect(thenResult).resolves.toBe('failure')
		await expect(catchResult).resolves.toBe('failure')
		await expect(finallyResult).resolves.toBe('failure')
		expect(finallyCount).toBe(1)
		expect(fixture.resource.current).toBeUndefined()
		expect(fixture.resource.loading).toBe(false)
		expect(fixture.resource.ready).toBe(false)
		expect(fixture.resource.error).toBe('failure')
	})

	it('retains a prior ready value while exposing a later error', async () => {
		const fixture = createFixture(readySnapshot('first'))
		await expect(fixture.resource).resolves.toBe('first')

		fixture.setSnapshot(errorSnapshot('failure'))
		expect(fixture.resource.current).toBe('first')
		expect(fixture.resource.loading).toBe(false)
		expect(fixture.resource.ready).toBe(true)
		expect(fixture.resource.error).toBe('failure')
		await expect(fixture.resource).rejects.toBe('failure')
	})

	it.each([false, true])('keeps recovery pending after an empty-string error; deletion=%s', async (deleteDuringRecovery) => {
		const fixture = createFixture(readySnapshot('first'))
		await expect(fixture.resource).resolves.toBe('first')

		fixture.setSnapshot(errorSnapshot(''))
		await expect(fixture.resource).rejects.toBe('')

		fixture.setSnapshot({
			...loadingSnapshot,
			data: 'first',
		})
		expect(fixture.resource.current).toBe('first')
		expect(fixture.resource.loading).toBe(true)
		expect(fixture.resource.ready).toBe(true)
		expect(fixture.resource.error).toBeUndefined()

		const recovered = fixture.resource.then((value) => value)
		if (deleteDuringRecovery) {
			fixture.setSnapshot(loadingSnapshot)
			expect(fixture.resource.current).toBeUndefined()
			expect(fixture.resource.ready).toBe(false)
			expect(fixture.resource.loading).toBe(true)
		}
		const laterAwaiter = fixture.resource.then((value) => value)
		fixture.setSnapshot(readySnapshot('recovered'))
		await expect(recovered).resolves.toBe('recovered')
		await expect(laterAwaiter).resolves.toBe('recovered')
	})

	it('uses the source status when an error snapshot has no detail', async () => {
		const fixture = createFixture({
			...errorSnapshot('unused'),
			error: undefined,
		})
		await expect(fixture.resource).rejects.toBe('error')
		expect(fixture.resource.error).toBe('error')
		fixture.resource.destroy()
	})

	it('resets a first-error promise before recovery', async () => {
		const fixture = createFixture()
		const failed = fixture.resource.catch((error) => String(error))
		fixture.setSnapshot(errorSnapshot('failure'))
		await expect(failed).resolves.toBe('failure')

		fixture.setSnapshot(loadingSnapshot)
		expect(fixture.resource.loading).toBe(true)
		const recovered = fixture.resource.then((value) => value)
		fixture.setSnapshot(readySnapshot('recovered'))
		await expect(recovered).resolves.toBe('recovered')
		expect(fixture.resource.current).toBe('recovered')
		expect(fixture.resource.ready).toBe(true)
		expect(fixture.resource.error).toBeUndefined()
	})

	it('reads the latest state when previously extracted catch and finally methods are invoked', async () => {
		const fixture = createFixture(readySnapshot('first'))
		await expect(fixture.resource).resolves.toBe('first')
		const catchLater = fixture.resource.catch
		const finallyLater = fixture.resource.finally
		let finallyCount = 0
		fixture.setSnapshot(errorSnapshot('later failure'))
		await expect(catchLater((error) => String(error))).resolves.toBe('later failure')
		await expect(finallyLater(() => {
			finallyCount += 1
		})).rejects.toBe('later failure')
		expect(finallyCount).toBe(1)
		fixture.resource.destroy()
	})

	it('keeps a browser-assimilated repeat read pending with the current source state', async () => {
		const fixture = createFixture(readySnapshot('first'))
		await expect(fixture.resource).resolves.toBe('first')
		expect(fixture.sourceSubscriptionCount).toBe(1)

		const repeatedRead = Promise.resolve(fixture.resource)
		fixture.setSnapshot(loadingSnapshot)
		let outcome = 'pending'
		const observed = repeatedRead.then(
			(value) => {
				outcome = 'resolved'
				return value
			},
			() => {
				outcome = 'rejected'
				return undefined
			}
		)

		await new Promise((resolve) => setTimeout(resolve, 0))
		const outcomeWhileSourcePending = outcome
		fixture.setSnapshot(readySnapshot('second'))
		const result = await observed
		const queryCount = fixture.queryCount
		const sourceSubscriptionCount = fixture.sourceSubscriptionCount
		fixture.resource.destroy()

		expect(outcomeWhileSourcePending).toBe('pending')
		expect(result).toBe('second')
		expect(queryCount).toBe(3)
		expect(sourceSubscriptionCount).toBe(1)
	})

	it('unsubscribes exactly once even when cleanup reenters destruction', async () => {
		let subscriptions = 0
		let unsubscriptions = 0
		const resource = new TanStackLiveQueryResource<string>(
			() => readySnapshot('ready'),
			() => {
				subscriptions++
				return () => {
					unsubscriptions++
					resource.destroy()
				}
			}
		)
		await expect(resource).resolves.toBe('ready')
		expect(subscriptions).toBe(1)

		resource.destroy()
		resource.destroy()
		expect(unsubscriptions).toBe(1)
	})

	it.each([false, true])('does not subscribe after destruction (deferred=%s)', async (deferred) => {
		const fixture = createFixture(readySnapshot('ready'))
		if (deferred)
			void fixture.resource.current

		fixture.resource.destroy()
		expect(fixture.resource.current).toBeUndefined()
		await new Promise((resolve) => setTimeout(resolve, 0))

		expect(fixture.sourceSubscriptionCount).toBe(0)
		expect(fixture.queryCount).toBe(0)
	})
})
