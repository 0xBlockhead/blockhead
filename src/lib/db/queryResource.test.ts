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
	[Symbol.toStringTag]: undefined,
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

	it('keeps the last ready value during refresh loading', async () => {
		const fixture = createFixture(readySnapshot('first'))
		await expect(fixture.resource).resolves.toBe('first')

		fixture.setSnapshot({
			...loadingSnapshot,
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

	it('returns getter and promise surfaces to one pending state after authoritative deletion', async () => {
		const fixture = createFixture(readySnapshot('first'))
		await expect(fixture.resource).resolves.toBe('first')

		fixture.setSnapshot(loadingSnapshot)
		expect(fixture.resource.current).toBeUndefined()
		expect(fixture.resource.loading).toBe(true)
		expect(fixture.resource.ready).toBe(false)
		expect(fixture.resource.error).toBeUndefined()

		const reloaded = fixture.resource.then((value) => value)
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
})
