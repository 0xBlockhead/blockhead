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
					for (const listener of channel.#listeners) listener({ data: message } as MessageEvent)
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
			name: crypto.randomUUID(), channel: new TestChannel('cold') as never, locks: lockManager() as never,
			openOwner: async () => ({ persistence: persistence(calls), close: () => { calls.push('close') } }),
		})
		await runtime.ready
		expect(runtime.phase).toBe('owner')
		await runtime.close()
		expect(calls).toEqual(['close'])
	})

	test('a follower proxies commits, receives invalidation, and promotes after owner teardown', async () => {
		const name = crypto.randomUUID()
		const locks = lockManager()
		const ownerCalls: string[] = []
		const followerCalls: string[] = []
		const owner = new BrowserPersistenceRuntime({
			name, channel: new TestChannel(name) as never, locks: locks as never,
			openOwner: async () => ({ persistence: persistence(ownerCalls), close: () => undefined }), heartbeatMs: 5,
		})
		await owner.ready
		const follower = new BrowserPersistenceRuntime({
			name, channel: new TestChannel(name) as never, locks: locks as never,
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

	test('starts as a follower when another owner is opening, then promotes after the owner disappears', async () => {
		const locks = lockManager()
		locks.hold()
		let opened = 0
		const runtime = new BrowserPersistenceRuntime({
			name: crypto.randomUUID(), channel: new TestChannel('opening') as never, locks: locks as never,
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
			name, channel: new TestChannel(name) as never, locks: lockManager() as never,
			openOwner: async () => ({ persistence: persistence(calls), close: () => undefined }),
		})
		await runtime.ready
		const follower = new BrowserPersistenceRuntime({
			name, channel: new TestChannel(name) as never, locks: { request: async (_name: string, _options: object, callback: (lock: Lock | null) => Promise<void>) => callback(null) } as never,
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
			name: crypto.randomUUID(), channel: new TestChannel('follower-before-owner') as never, locks: locks as never,
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
			name: crypto.randomUUID(), channel: new TestChannel('bounded-bootstrap') as never,
			locks: { request: async () => new Promise<void>(() => {}) } as never,
			openOwner: async () => ({ persistence: persistence([]), close: () => undefined }),
			bootstrapTimeoutMs: 10,
			requestTimeoutMs: 5,
		})
		const pending = runtime.persistence.adapter.loadSubset('rows', {} as never)
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
			name, channel: new TestChannel(name) as never, locks: locks as never,
			openOwner: async () => ({ persistence: persistence(calls), close: () => undefined }),
		})
		await owner.ready
		const follower = new BrowserPersistenceRuntime({
			name, channel: new TestChannel(name) as never, locks: locks as never,
			openOwner: async () => ({ persistence: persistence([]), close: () => undefined }), requestTimeoutMs: 10,
		})
		await follower.ready
		const request = follower.persistence.adapter.applyCommittedTx('rows', {
			txId: 'durable-tx', term: 1, seq: 1, rowVersion: 1, mutations: [],
		} as never)
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
			name: crypto.randomUUID(), channel: new TestChannel('timeout') as never, locks: lockManager() as never,
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

	test('close is idempotent and clears pending request retries', async () => {
		vi.useFakeTimers()
		const runtime = new BrowserPersistenceRuntime({
			name: crypto.randomUUID(), channel: new TestChannel('teardown') as never, locks: lockManager() as never,
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
