import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import type { CollectionStatus } from '@tanstack/db'

import {
	subscribeToLiveQueryCollections,
	waitForLiveQueryCollections,
} from '$/client/$subscribe.svelte.ts'


describe('live query collection lifecycle', () => {
	it('disposes first-ready callbacks with the other live subscriptions', () => {
		const status: CollectionStatus = 'loading'
		const disposeFailureSubscription = vi.fn()
		const disposeFirstReady = vi.fn()
		const disposeChanges = vi.fn()
		const collection = {
			status,
			isLoadingSubset: true,
			onFirstReady: vi.fn((_update: () => void) => disposeFirstReady),
			on: vi.fn((_event: 'loadingSubset:change', _update: () => void) => vi.fn()),
			preload: vi.fn(async () => {}),
			subscribeChanges: vi.fn((_update: () => void) => ({
				unsubscribe: disposeChanges,
			})),
		}

		const unsubscribe = subscribeToLiveQueryCollections(
			[{
				collection,
			}],
			vi.fn(),
			() => disposeFailureSubscription
		)
		unsubscribe()

		expect(disposeFailureSubscription).toHaveBeenCalledOnce()
		expect(disposeFirstReady).toHaveBeenCalledOnce()
		expect(disposeChanges).toHaveBeenCalledOnce()
	})

	it('ignores a pending preload rejection after subscription teardown', async () => {
		const preload = Promise.withResolvers<void>()
		const update = vi.fn()
		const status: CollectionStatus = 'idle'
		const collection = {
			status,
			isLoadingSubset: false,
			onFirstReady: vi.fn((_update: () => void) => vi.fn()),
			on: vi.fn((_event: 'loadingSubset:change', _update: () => void) => vi.fn()),
			preload: vi.fn(() => preload.promise),
			subscribeChanges: vi.fn((_update: () => void) => ({
				unsubscribe: vi.fn(),
			})),
		}

		const unsubscribe = subscribeToLiveQueryCollections(
			[{
				collection,
			}],
			update,
			() => vi.fn()
		)
		expect(collection.preload).toHaveBeenCalledOnce()
		unsubscribe()

		const lateFailure = new Error('late preload failure')
		preload.reject(lateFailure)
		await expect(preload.promise).rejects.toBe(lateFailure)
		await new Promise((resolve) => setTimeout(resolve, 0))

		expect(update).not.toHaveBeenCalled()
	})

	it('does not retain listeners when first-ready completes synchronously', async () => {
		const status: CollectionStatus = 'ready'
		const disposeFirstReady = vi.fn()
		const disposeLoadingSubset = vi.fn()
		const collection = {
			status,
			isLoadingSubset: false,
			onFirstReady: vi.fn((complete: () => void) => {
				complete()
				return disposeFirstReady
			}),
			on: vi.fn((_event: 'loadingSubset:change', _update: () => void) => disposeLoadingSubset),
			preload: vi.fn(async () => {}),
		}

		await waitForLiveQueryCollections([{
			collection,
		}])

		expect(disposeFirstReady).toHaveBeenCalledOnce()
		expect(collection.on).not.toHaveBeenCalled()
		expect(disposeLoadingSubset).not.toHaveBeenCalled()
	})

	it('disposes delayed first-ready and loading listeners together', async () => {
		let status: CollectionStatus = 'loading'
		let completeFirstReady = () => {
			throw new Error('first-ready callback not registered')
		}
		const disposeFirstReady = vi.fn()
		const disposeLoadingSubset = vi.fn()
		const collection = {
			get status() {
				return status
			},
			isLoadingSubset: false,
			onFirstReady: vi.fn((complete: () => void) => {
				completeFirstReady = complete
				return disposeFirstReady
			}),
			on: vi.fn((_event: 'loadingSubset:change', _update: () => void) => disposeLoadingSubset),
			preload: vi.fn(async () => {}),
		}

		const ready = waitForLiveQueryCollections([{
			collection,
		}])
		status = 'ready'
		completeFirstReady()
		await ready

		expect(disposeFirstReady).toHaveBeenCalledOnce()
		expect(disposeLoadingSubset).toHaveBeenCalledOnce()
	})
})
