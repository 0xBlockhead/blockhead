import {
	createCollection,
	localOnlyCollectionOptions,
} from '@tanstack/db'
import {
	describe,
	expect,
	test,
	vi,
} from 'vitest'
import type {
	PersistedCollectionPersistence,
	PersistenceAdapter,
} from '@tanstack/db-sqlite-persistence-core'

import { BrowserPersistenceRuntime } from './browserPersistenceRuntime.ts'


class TestChannel {
	static channels = new Map<string, Set<TestChannel>>()
	static droppedResponses = 0
	static dropNextResponse = false
	#listeners = new Set<(event: MessageEvent) => void>()
	#name: string

	constructor(name: string) {
		this.#name = name
		const channels = TestChannel.channels.get(name) ?? new Set<TestChannel>()
		channels.add(this)
		TestChannel.channels.set(name, channels)
	}

	postMessage(message: unknown) {
		if ((message as { type?: string }).type === 'response' && TestChannel.droppedResponses > 0) {
			TestChannel.droppedResponses--
			return
		}
		if (
			TestChannel.dropNextResponse
			&& typeof message === 'object'
			&& message !== null
			&& 'type' in message
			&& message.type === 'response'
		) {
			TestChannel.dropNextResponse = false
			return
		}
		for (const channel of TestChannel.channels.get(this.#name) ?? [])
			if (channel !== this)
				queueMicrotask(() => {
					const clonedMessage = structuredClone(message)
					for (const listener of channel.#listeners) listener({ data: clonedMessage } as MessageEvent)
				})
	}

	addEventListener(_type: string, listener: (event: MessageEvent) => void) { this.#listeners.add(listener) }
	removeEventListener(_type: string, listener: (event: MessageEvent) => void) { this.#listeners.delete(listener) }
	close() { TestChannel.channels.get(this.#name)?.delete(this) }
}

const lockManager = () => {
	let held = false
	return {
		hold: () => { held = true },
		release: () => { held = false },
		request: async (_name: string, _options: object, callback: (lock: Lock | null) => Promise<void>) => {
			if (held) return callback(null)
			held = true
			try { await callback({} as Lock) } finally { held = false }
		},
	}
}

const persistence = (calls: string[]): PersistedCollectionPersistence => ({
	adapter: {
		loadSubset: async () => [],
		applyCommittedTx: async () => { calls.push('commit') },
		ensureIndex: async () => { calls.push('index') },
	},
})

const wait = async () => new Promise<void>((resolve) => setTimeout(resolve, 10))

describe('BrowserPersistenceRuntime', () => {
	test('opens OPFS only in the cold owner and tears its handle down', async () => {
		const calls: string[] = []
		const runtime = new BrowserPersistenceRuntime({
			name: crypto.randomUUID(), channel: new TestChannel('cold'), locks: lockManager(),
			openOwner: async () => ({ persistence: persistence(calls), close: () => { calls.push('close') } }),
		})
		await runtime.ready
		expect(runtime.phase).toBe('owner')
		await runtime.close()
		expect(calls).toEqual(['close'])
	})

	test('fails one clean owner open instead of reopening a stale profile', async () => {
		let opens = 0
		const runtime = new BrowserPersistenceRuntime({
			name: crypto.randomUUID(),
			channel: new TestChannel('failed-owner'),
			locks: lockManager(),
			openOwner: async () => {
				opens++
				throw new Error('sqlite3_open_v2')
			},
			heartbeatMs: 5,
		})
		await expect(runtime.ready).rejects.toThrow('sqlite3_open_v2')
		await wait()
		expect(runtime.phase).toBe('closed')
		expect(opens).toBe(1)
	})

	test('drains owner work before closing its worker and releasing its lease', async () => {
		const calls: string[] = []
		const locks = lockManager()
		const started = Promise.withResolvers<void>()
		const finish = Promise.withResolvers<void>()
		const name = crypto.randomUUID()
		const owner = new BrowserPersistenceRuntime({
			name,
			channel: new TestChannel(name),
			locks: locks,
			openOwner: async () => ({
				persistence: {
					adapter: {
						...persistence(calls).adapter,
						applyCommittedTx: async () => {
							calls.push('commit:start')
							started.resolve()
							await finish.promise
							calls.push('commit:finish')
						},
					},
				},
				close: () => { calls.push('close') },
			}),
		})
		await owner.ready
		const commit = owner.persistence.adapter.applyCommittedTx('rows', {} as never)
		await started.promise
		const close = owner.close()
		const follower = new BrowserPersistenceRuntime({
			name,
			channel: new TestChannel(name),
			locks: locks,
			openOwner: async () => ({ persistence: persistence([]), close: () => undefined }),
			heartbeatMs: 5,
		})
		await follower.ready
		expect(calls).toEqual(['commit:start'])
		expect(follower.phase).toBe('follower')
		finish.resolve()
		await commit
		await close
		expect(calls).toEqual(['commit:start', 'commit:finish', 'close'])
		await new Promise<void>((resolve) => setTimeout(resolve, 25))
		expect(follower.phase).toBe('owner')
		await follower.close()
	})

	test('a follower proxies commits, receives invalidation, and promotes after owner teardown', async () => {
		const name = crypto.randomUUID()
		const locks = lockManager()
		const ownerCalls: string[] = []
		const followerCalls: string[] = []
		const owner = new BrowserPersistenceRuntime({
			name, channel: new TestChannel(name), locks: locks,
			openOwner: async () => ({ persistence: persistence(ownerCalls), close: () => undefined }), heartbeatMs: 5,
		})
		await owner.ready
		const follower = new BrowserPersistenceRuntime({
			name, channel: new TestChannel(name), locks: locks,
			openOwner: async () => ({ persistence: persistence(followerCalls), close: () => undefined }), heartbeatMs: 5,
		})
		await follower.ready
		const invalidations: string[] = []
		follower.subscribeInvalidations((operation) => invalidations.push(operation))
		await follower.persistence.adapter.applyCommittedTx('rows', {} as never)
		expect(ownerCalls).toEqual(['commit'])
		await wait()
		expect(invalidations).toEqual(['applyCommittedTx'])
		await owner.close()
		await new Promise<void>((resolve) => setTimeout(resolve, 25))
		expect(follower.phase).toBe('owner')
		await follower.close()
	})

	test('removes the local subscription object before follower RPC structured clone', async () => {
		const name = crypto.randomUUID()
		const locks = lockManager()
		const ownerLoads: object[] = []
		const owner = new BrowserPersistenceRuntime({
			name,
			channel: new TestChannel(name),
			locks: locks,
			openOwner: async () => ({
				persistence: {
					adapter: {
						...persistence([]).adapter,
						loadSubset: async (_collectionId, options) => {
							ownerLoads.push(options)
							return []
						},
					},
				},
				close: () => undefined,
			}),
		})
		await owner.ready
		const follower = new BrowserPersistenceRuntime({
			name,
			channel: new TestChannel(name),
			locks: locks,
			openOwner: async () => ({ persistence: persistence([]), close: () => undefined }),
		})
		await follower.ready
		const collection = createCollection(localOnlyCollectionOptions({
			getKey: (row: { id: string }) => row.id,
		}))
		const subscription = collection.subscribeChanges(() => {})
		await follower.persistence.adapter.loadSubset('rows', {
			limit: 1,
			subscription,
		})
		expect(ownerLoads).toEqual([{ limit: 1 }])
		subscription.unsubscribe()
		await collection.cleanup()
		await follower.close()
		await owner.close()
	})

	test('preserves collection mode and schema selection through follower RPC', async () => {
		const name = crypto.randomUUID()
		const locks = lockManager()
		const selections: string[] = []
		const ownerPersistence: PersistedCollectionPersistence = {
			...persistence([]),
			resolvePersistenceForCollection: ({
				collectionId,
				mode,
				schemaVersion,
			}) => ({
				adapter: {
					...persistence([]).adapter,
					applyCommittedTx: async () => {
						selections.push(`${collectionId}:${mode}:${schemaVersion}`)
					},
				},
			}),
		}
		const owner = new BrowserPersistenceRuntime({
			name,
			channel: new TestChannel(name),
			locks: locks,
			openOwner: async () => ({ persistence: ownerPersistence, close: () => undefined }),
		})
		await owner.ready
		const follower = new BrowserPersistenceRuntime({
			name,
			channel: new TestChannel(name),
			locks: locks,
			openOwner: async () => ({ persistence: persistence([]), close: () => undefined }),
		})
		await follower.ready
		const selectedPersistence = follower.persistence.resolvePersistenceForCollection?.({
			collectionId: 'Entity Persisted',
			mode: 'sync-present',
			schemaVersion: 13,
		})
		await selectedPersistence?.adapter.applyCommittedTx('Entity Persisted', {} as never)
		expect(selections).toEqual(['Entity Persisted:sync-present:13'])
		await follower.close()
		await owner.close()
	})

	test('replays an unacknowledged committed transaction after owner death', async () => {
		const name = crypto.randomUUID()
		const locks = lockManager()
		const appliedTransactions = new Set<string>()
		let attempts = 0
		let owner: BrowserPersistenceRuntime
		const durablePersistence = (): PersistedCollectionPersistence => ({
			adapter: {
				...persistence([]).adapter,
				applyCommittedTx: async (_collectionId, transaction) => {
					attempts++
					appliedTransactions.add(transaction.txId)
					if (attempts === 1)
						void owner.close()
				},
			},
		})
		owner = new BrowserPersistenceRuntime({
			name,
			channel: new TestChannel(name),
			locks: locks,
			openOwner: async () => ({ persistence: durablePersistence(), close: () => undefined }),
			heartbeatMs: 5,
			requestTimeoutMs: 5,
		})
		await owner.ready
		const follower = new BrowserPersistenceRuntime({
			name,
			channel: new TestChannel(name),
			locks: locks,
			openOwner: async () => ({ persistence: durablePersistence(), close: () => undefined }),
			heartbeatMs: 5,
			requestTimeoutMs: 5,
		})
		await follower.ready
		await follower.persistence.adapter.applyCommittedTx('rows', {
			txId: 'committed-before-owner-death',
			term: 1,
			seq: 1,
			rowVersion: 1,
			mutations: [],
		})
		expect(attempts).toBe(2)
		expect(appliedTransactions).toEqual(new Set(['committed-before-owner-death']))
		expect(follower.phase).toBe('owner')
		await follower.close()
	})

	test('starts as a follower when another owner is opening, then promotes after the owner disappears', async () => {
		const locks = lockManager()
		locks.hold()
		let opened = 0
		const runtime = new BrowserPersistenceRuntime({
			name: crypto.randomUUID(), channel: new TestChannel('opening'), locks: locks,
			openOwner: async () => {
				opened++
				return { persistence: persistence([]), close: () => undefined }
			}, heartbeatMs: 5,
		})
		await runtime.ready
		expect(runtime.phase).toBe('follower')
		locks.release()
		await new Promise<void>((resolve) => setTimeout(resolve, 25))
		expect(runtime.phase).toBe('owner')
		expect(opened).toBe(1)
		await runtime.close()
	})

	test('replays a lost acknowledgement with the same request id exactly once', async () => {
		const calls: string[] = []
		const name = crypto.randomUUID()
		const runtime = new BrowserPersistenceRuntime({
			name, channel: new TestChannel(name), locks: lockManager(),
			openOwner: async () => ({ persistence: persistence(calls), close: () => undefined }),
		})
		await runtime.ready
		const follower = new BrowserPersistenceRuntime({
			name, channel: new TestChannel(name), locks: { request: async (_name: string, _options: object, callback: (lock: Lock | null) => Promise<void>) => callback(null) },
			openOwner: async () => ({ persistence: persistence([]), close: () => undefined }), requestTimeoutMs: 5,
		})
		await follower.ready
		TestChannel.dropNextResponse = true
		await follower.persistence.adapter.applyCommittedTx('rows', {} as never)
		expect(calls).toEqual(['commit'])
		await follower.close()
		await runtime.close()
	})

	test('promotes a follower that started while an external owner held the lock', async () => {
		let externallyHeld = true
		const calls: string[] = []
		const locks = {
			request: async (_name: string, _options: object, callback: (lock: Lock | null) => Promise<void>) => (
				callback(externallyHeld ? null : {} as Lock)
			),
		}
		const runtime = new BrowserPersistenceRuntime({
			name: crypto.randomUUID(), channel: new TestChannel('follower-before-owner'), locks: locks,
			openOwner: async () => ({ persistence: persistence(calls), close: () => undefined }), heartbeatMs: 5,
			requestTimeoutMs: 5,
		})
		await runtime.ready
		expect(runtime.phase).toBe('follower')
		const pendingCommit = runtime.persistence.adapter.applyCommittedTx('rows', {} as never)
		externallyHeld = false
		await new Promise<void>((resolve) => setTimeout(resolve, 25))
		expect(runtime.phase).toBe('owner')
		await pendingCommit
		expect(calls).toEqual(['commit'])
		await runtime.close()
	})

	test('fails a bounded bootstrap and rejects pending follower work during teardown', async () => {
		const runtime = new BrowserPersistenceRuntime({
			name: crypto.randomUUID(), channel: new TestChannel('bounded-bootstrap'),
			locks: { request: async () => new Promise<void>(() => {}) },
			openOwner: async () => ({ persistence: persistence([]), close: () => undefined }),
			bootstrapTimeoutMs: 10,
			requestTimeoutMs: 5,
		})
		const pending = runtime.persistence.adapter.loadSubset('rows', {})
		await expect(runtime.ready).rejects.toThrow('bootstrap timed out')
		await expect(pending).rejects.toThrow('runtime closed')
		expect(runtime.phase).toBe('closed')
	})

	test('retries a lost acknowledgement with the same request id', async () => {
		vi.useFakeTimers()
		TestChannel.droppedResponses = 1
		const calls: string[] = []
		const name = crypto.randomUUID()
		const locks = lockManager()
		const owner = new BrowserPersistenceRuntime({
			name, channel: new TestChannel(name), locks: locks,
			openOwner: async () => ({ persistence: persistence(calls), close: () => undefined }),
		})
		await owner.ready
		const follower = new BrowserPersistenceRuntime({
			name, channel: new TestChannel(name), locks: locks,
			openOwner: async () => ({ persistence: persistence([]), close: () => undefined }), requestTimeoutMs: 10,
		})
		await follower.ready
		const request = follower.persistence.adapter.applyCommittedTx('rows', {
			txId: 'durable-tx', term: 1, seq: 1, rowVersion: 1, mutations: [],
		})
		await vi.advanceTimersByTimeAsync(20)
		await request
		expect(calls).toEqual(['commit'])
		await follower.close()
		await owner.close()
		vi.useRealTimers()
	})

	test('bounds a stalled bootstrap and tears down every timer', async () => {
		vi.useFakeTimers()
		const runtime = new BrowserPersistenceRuntime({
			name: crypto.randomUUID(), channel: new TestChannel('timeout'), locks: lockManager(),
			openOwner: () => new Promise<never>(() => undefined), bootstrapTimeoutMs: 10, heartbeatMs: 5,
		})
		const ready = expect(runtime.ready).rejects.toThrow('bootstrap timed out')
		await vi.advanceTimersByTimeAsync(10)
		await ready
		expect(runtime.phase).toBe('closed')
		expect(vi.getTimerCount()).toBe(0)
		await runtime.close()
		vi.useRealTimers()
	})

	test('closes an owner that finishes after bootstrap timeout without leaking heartbeat failures', async () => {
		vi.useFakeTimers()
		const opened = Promise.withResolvers<void>()
		const closed = vi.fn()
		const runtime = new BrowserPersistenceRuntime({
			name: crypto.randomUUID(),
			channel: new TestChannel('late-owner'),
			locks: lockManager(),
			openOwner: async () => {
				await opened.promise
				return {
					persistence: persistence([]),
					close: closed,
				}
			},
			bootstrapTimeoutMs: 25,
			heartbeatMs: 5,
		})
		try {
			const ready = expect(runtime.ready).rejects.toThrow('bootstrap timed out')
			await vi.advanceTimersByTimeAsync(25)
			await ready
			opened.resolve()
			await vi.advanceTimersByTimeAsync(0)
			expect(closed).toHaveBeenCalledOnce()
			expect(runtime.phase).toBe('closed')
			expect(vi.getTimerCount()).toBe(0)
		} finally {
			await runtime.close()
			vi.useRealTimers()
		}
	})

	test('closes a ready follower and rejects its work when later owner promotion fails', async () => {
		vi.useFakeTimers()
		const locks = lockManager()
		locks.hold()
		const openOwner = vi.fn(async () => {
			throw new Error('owner unavailable')
		})
		const runtime = new BrowserPersistenceRuntime({
			name: crypto.randomUUID(),
			channel: new TestChannel('failed-promotion'),
			locks,
			openOwner,
			heartbeatMs: 5,
		})
		try {
			await runtime.ready
			expect(runtime.phase).toBe('follower')
			const pending = expect(runtime.persistence.adapter.loadSubset('rows', {}))
				.rejects.toThrow('runtime closed')
			locks.release()
			await vi.advanceTimersByTimeAsync(25)
			await pending
			expect(openOwner).toHaveBeenCalledOnce()
			expect(runtime.phase).toBe('closed')
			expect(vi.getTimerCount()).toBe(0)
		} finally {
			await runtime.close()
			vi.useRealTimers()
		}
	})

	test.each([true, false])('keeps a closed runtime closed when a lock callback arrives late (available=%s)', async (available) => {
		vi.useFakeTimers()
		const delivered = Promise.withResolvers<void>()
		const openOwner = vi.fn(async () => ({
			persistence: persistence([]),
			close: () => undefined,
		}))
		const runtime = new BrowserPersistenceRuntime({
			name: crypto.randomUUID(),
			channel: new TestChannel('late-lock'),
			locks: {
				request: async (name, options, callback) => {
					await delivered.promise
					await callback(available ? {
						name,
						mode: options.mode,
					} : null)
				},
			},
			openOwner,
			bootstrapTimeoutMs: 25,
			heartbeatMs: 5,
		})
		try {
			const ready = expect(runtime.ready).rejects.toThrow('bootstrap timed out')
			await vi.advanceTimersByTimeAsync(25)
			await ready
			delivered.resolve()
			await vi.advanceTimersByTimeAsync(0)
			expect(openOwner).not.toHaveBeenCalled()
			expect(runtime.phase).toBe('closed')
			expect(vi.getTimerCount()).toBe(0)
		} finally {
			await runtime.close()
			vi.useRealTimers()
		}
	})

	test('close is idempotent and clears pending request retries', async () => {
		vi.useFakeTimers()
		const runtime = new BrowserPersistenceRuntime({
			name: crypto.randomUUID(), channel: new TestChannel('teardown'), locks: lockManager(),
			openOwner: async () => ({ persistence: persistence([]), close: () => undefined }), requestTimeoutMs: 10,
		})
		await runtime.ready
		const close = runtime.close()
		await Promise.all([close, runtime.close()])
		expect(runtime.phase).toBe('closed')
		expect(vi.getTimerCount()).toBe(0)
		vi.useRealTimers()
	})
})
