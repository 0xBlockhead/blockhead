import type {
	PersistedCollectionMode,
	PersistedCollectionPersistence,
	PersistenceAdapter,
} from '@tanstack/db-sqlite-persistence-core'


export type BrowserPersistencePhase = 'opening' | 'owner' | 'follower' | 'recovering' | 'closed'

type AdapterOperation = keyof PersistenceAdapter

type PersistenceSelection =
	| {
		type: 'collection'
		options: {
			collectionId: string
			mode: PersistedCollectionMode
			schemaVersion?: number
		}
	}
	| { type: 'mode'; mode: PersistedCollectionMode }
	| undefined

type RuntimeMessage =
	| { type: 'heartbeat'; ownerId: string }
	| {
		type: 'request'
		requestId: string
		operation: AdapterOperation
		arguments: unknown[]
		selection: PersistenceSelection
	}
	| { type: 'response'; requestId: string; result?: unknown; error?: string }
	| { type: 'invalidation'; operation: AdapterOperation }

type BroadcastPort = {
	postMessage(message: RuntimeMessage): void
	addEventListener(type: 'message', listener: (event: MessageEvent<RuntimeMessage>) => void): void
	removeEventListener(type: 'message', listener: (event: MessageEvent<RuntimeMessage>) => void): void
	close(): void
}

type LockManager = {
	request(
		name: string,
		options: { ifAvailable: true; mode: 'exclusive' },
		callback: (lock: Lock | null) => Promise<void>
	): Promise<void>
}

export type BrowserPersistenceRuntimeOptions = {
	name: string
	openOwner: () => Promise<{
		persistence: PersistedCollectionPersistence
		close: () => Promise<void> | void
	}>
	bootstrapTimeoutMs?: number
	heartbeatMs?: number
	requestTimeoutMs?: number
	channel?: BroadcastPort
	locks?: LockManager
}

/**
 * The sole browser owner opens OPFS. Every other tab gets the exact same
 * PersistenceAdapter surface through an idempotent BroadcastChannel RPC.
 */
export class BrowserPersistenceRuntime {
	#channel: BroadcastPort
	#closeOwner: (() => Promise<void> | void) | undefined
	#closePromise: Promise<void> | undefined
	#closed = false
	#completed = new Map<string, Promise<RuntimeMessage>>()
	#heartbeat: ReturnType<typeof setInterval> | undefined
	#bootstrapTimeout: ReturnType<typeof setTimeout> | undefined
	#invalidationSubscribers = new Set<(operation: AdapterOperation) => void>()
	#lastHeartbeat = performance.now()
	#lockRelease = Promise.withResolvers<void>()
	#ownerPersistence: PersistedCollectionPersistence | undefined
	#ownerQueue = Promise.resolve()
	#pending = new Map<string, {
		arguments: unknown[]
		deferred: PromiseWithResolvers<unknown>
		operation: AdapterOperation
		removeAbortListener?: () => void
		selection: PersistenceSelection
		timer: ReturnType<typeof setInterval>
	}>()
	#phase: BrowserPersistencePhase = 'opening'
	#phaseSubscribers = new Set<(phase: BrowserPersistencePhase) => void>()
	#persistence: PersistedCollectionPersistence
	#promoting = false
	#ready: Promise<void>
	#readyDeferred = Promise.withResolvers<void>()
	#readySettled = false
	#requestTimeoutMs: number
	#runtimeId = crypto.randomUUID()

	constructor(options: BrowserPersistenceRuntimeOptions) {
		const heartbeatMs = options.heartbeatMs ?? 250
		const bootstrapTimeoutMs = options.bootstrapTimeoutMs ?? 5_000
		this.#requestTimeoutMs = options.requestTimeoutMs ?? 500
		this.#channel = options.channel ?? new BroadcastChannel(`blockhead:sqlite:${options.name}`)
		this.#channel.addEventListener('message', this.#onMessage)
		this.#persistence = this.#createPersistenceFacade()
		this.#heartbeat = setInterval(() => {
			if (this.#closed) return
			if (this.#ownerPersistence !== undefined)
				this.#channel.postMessage({ type: 'heartbeat', ownerId: this.#runtimeId })
			else if (performance.now() - this.#lastHeartbeat > heartbeatMs * 3) {
				void this.#promote(options)
			}
		}, heartbeatMs)
		this.#ready = this.#readyDeferred.promise
		this.#bootstrapTimeout = setTimeout(() => {
			if (this.#readySettled || this.#closed) return
			const error = new Error('SQLite persistence owner bootstrap timed out')
			this.#settleReady(error)
			void this.close()
		}, bootstrapTimeoutMs)
		void this.#promote(options)
	}

	get persistence() { return this.#persistence }
	get phase() { return this.#phase }
	get ready() { return this.#ready }

	subscribePhase(subscriber: (phase: BrowserPersistencePhase) => void) {
		this.#phaseSubscribers.add(subscriber)
		subscriber(this.#phase)
		return () => this.#phaseSubscribers.delete(subscriber)
	}

	subscribeInvalidations(subscriber: (operation: AdapterOperation) => void) {
		this.#invalidationSubscribers.add(subscriber)
		return () => this.#invalidationSubscribers.delete(subscriber)
	}

	async close() {
		if (this.#closePromise !== undefined) return this.#closePromise
		this.#closed = true
		this.#settleReady(new Error('SQLite persistence runtime closed'))
		this.#setPhase('closed')
		if (this.#heartbeat !== undefined) clearInterval(this.#heartbeat)
		if (this.#bootstrapTimeout !== undefined) clearTimeout(this.#bootstrapTimeout)
		this.#closePromise = (async () => {
			await this.#ownerQueue
			await this.#closeOwner?.()
			this.#lockRelease.resolve()
			this.#channel.removeEventListener('message', this.#onMessage)
			this.#channel.close()
			for (const pending of this.#pending.values()) {
				clearInterval(pending.timer)
				pending.deferred.reject(new Error('SQLite persistence runtime closed'))
			}
			this.#pending.clear()
		})()
		return this.#closePromise
	}

	#createPersistenceFacade(
		selection?: PersistenceSelection
	): PersistedCollectionPersistence {
		const adapter: PersistenceAdapter = {
			loadSubset: (collectionId, options, context) => {
				const { subscription: _subscription, ...serializableOptions } = options
				return this.#call('loadSubset', [collectionId, serializableOptions, context], selection)
			},
			applyCommittedTx: (...arguments_) => this.#call('applyCommittedTx', arguments_, selection),
			loadCollectionMetadata: (...arguments_) => this.#call('loadCollectionMetadata', arguments_, selection),
			scanRows: (...arguments_) => this.#call('scanRows', arguments_, selection),
			ensureIndex: (...arguments_) => this.#call('ensureIndex', arguments_, selection),
			markIndexRemoved: (...arguments_) => this.#call('markIndexRemoved', arguments_, selection),
			getStreamPosition: (...arguments_) => this.#call('getStreamPosition', arguments_, selection),
		}
		return {
			adapter,
			resolvePersistenceForCollection: (options) => this.#createPersistenceFacade({
				type: 'collection',
				options,
			}),
			resolvePersistenceForMode: (mode) => this.#createPersistenceFacade({
				type: 'mode',
				mode,
			}),
		}
	}

	async #promote(options: BrowserPersistenceRuntimeOptions) {
		if (this.#closed || this.#ownerPersistence !== undefined) return
		if (this.#promoting) return
		const locks = options.locks ?? navigator.locks
		this.#promoting = true
		try {
			await locks.request(`blockhead:sqlite:${options.name}`, { ifAvailable: true, mode: 'exclusive' }, async (lock) => {
				if (this.#closed)
					return

				if (lock === null) {
					this.#setPhase('follower')
					this.#settleReady()
					return
				}
				this.#setPhase('recovering')
				const owner = await options.openOwner()
				// oxlint-disable-next-line typescript/no-unnecessary-condition -- Bootstrap timeout can close the runtime during openOwner; the late-owner regression covers this race.
				if (this.#closed) {
					await owner.close()
					return
				}
				this.#ownerPersistence = owner.persistence
				this.#closeOwner = owner.close
				this.#setPhase('owner')
				this.#replayPendingLocally()
				this.#channel.postMessage({ type: 'heartbeat', ownerId: this.#runtimeId })
				this.#settleReady()
				await this.#lockRelease.promise
			})
		} catch (error) {
			this.#settleReady(error)
			void this.close()
		} finally {
			this.#promoting = false
		}
	}

	#call(
		operation: 'loadSubset',
		arguments_: Parameters<PersistenceAdapter['loadSubset']>,
		selection: PersistenceSelection
	): ReturnType<PersistenceAdapter['loadSubset']>
	#call(
		operation: 'applyCommittedTx',
		arguments_: Parameters<PersistenceAdapter['applyCommittedTx']>,
		selection: PersistenceSelection
	): ReturnType<PersistenceAdapter['applyCommittedTx']>
	#call(
		operation: 'loadCollectionMetadata',
		arguments_: Parameters<NonNullable<PersistenceAdapter['loadCollectionMetadata']>>,
		selection: PersistenceSelection
	): ReturnType<NonNullable<PersistenceAdapter['loadCollectionMetadata']>>
	#call(
		operation: 'scanRows',
		arguments_: Parameters<NonNullable<PersistenceAdapter['scanRows']>>,
		selection: PersistenceSelection
	): ReturnType<NonNullable<PersistenceAdapter['scanRows']>>
	#call(
		operation: 'ensureIndex',
		arguments_: Parameters<PersistenceAdapter['ensureIndex']>,
		selection: PersistenceSelection
	): ReturnType<PersistenceAdapter['ensureIndex']>
	#call(
		operation: 'markIndexRemoved',
		arguments_: Parameters<NonNullable<PersistenceAdapter['markIndexRemoved']>>,
		selection: PersistenceSelection
	): ReturnType<NonNullable<PersistenceAdapter['markIndexRemoved']>>
	#call(
		operation: 'getStreamPosition',
		arguments_: Parameters<NonNullable<PersistenceAdapter['getStreamPosition']>>,
		selection: PersistenceSelection
	): ReturnType<NonNullable<PersistenceAdapter['getStreamPosition']>>
	#call(
		operation: AdapterOperation,
		arguments_: unknown[],
		selection: PersistenceSelection
	): Promise<unknown> {
		if (this.#closed) return Promise.reject(new Error('SQLite persistence runtime closed'))
		if (this.#ownerPersistence !== undefined)
			return this.#execute(operation, arguments_, selection)
		const requestId = crypto.randomUUID()
		const deferred = Promise.withResolvers<unknown>()
		const requestSignal = operation === 'loadSubset'
			? (arguments_[1] as Parameters<PersistenceAdapter['loadSubset']>[1]).signal
			: undefined
		if (requestSignal?.aborted === true)
			return Promise.reject(requestSignal.reason)
		const remoteArguments = operation === 'loadSubset' ? (() => {
			const [collectionId, options, context] = arguments_ as Parameters<PersistenceAdapter['loadSubset']>
			const {
				signal: _signal,
				subscription: _subscription,
				...serializableOptions
			} = options
			return [collectionId, serializableOptions, context]
		})() : arguments_
		const send = () => this.#channel.postMessage({
			type: 'request',
			requestId,
			operation,
			arguments: remoteArguments,
			selection,
		})
		send()
		const retry = setInterval(send, this.#requestTimeoutMs)
		const abort = requestSignal === undefined ? undefined : () => {
			clearInterval(retry)
			deferred.reject(requestSignal.reason)
		}
		if (abort !== undefined)
			requestSignal.addEventListener('abort', abort, { once: true })
		this.#pending.set(requestId, {
			arguments: arguments_,
			deferred,
			operation,
			removeAbortListener: abort === undefined ? undefined : () => requestSignal.removeEventListener('abort', abort),
			selection,
			timer: retry,
		})
		return deferred.promise.then((result) => {
			requestSignal?.throwIfAborted()
			return result
		}).finally(() => {
			clearInterval(retry)
			this.#pending.get(requestId)?.removeAbortListener?.()
			this.#pending.delete(requestId)
		})
	}

	#onMessage = (event: MessageEvent<RuntimeMessage>) => {
		const message = event.data
		if (message.type === 'heartbeat') {
			if (message.ownerId !== this.#runtimeId) this.#lastHeartbeat = performance.now()
			return
		}
		if (message.type === 'response') {
			const pending = this.#pending.get(message.requestId)
			if (pending === undefined) return
			clearInterval(pending.timer)
			if (message.error === undefined) pending.deferred.resolve(message.result)
			else pending.deferred.reject(new Error(message.error))
			return
		}
		if (message.type === 'invalidation') {
			for (const subscriber of this.#invalidationSubscribers) subscriber(message.operation)
			return
		}
		if (this.#ownerPersistence === undefined) return
		const completed = this.#completed.get(message.requestId) ?? this.#invoke(message)
		this.#completed.set(message.requestId, completed)
		void completed.then((response) => {
			if (!this.#closed) this.#channel.postMessage(response)
		})
	}

	async #invoke(message: Extract<RuntimeMessage, { type: 'request' }>): Promise<RuntimeMessage> {
		try {
			const result = await this.#execute(
				message.operation,
				message.arguments,
				message.selection
			)
			if (!this.#closed)
				this.#channel.postMessage({ type: 'invalidation', operation: message.operation })
			return { type: 'response', requestId: message.requestId, result }
		} catch (error) {
			return { type: 'response', requestId: message.requestId, error: error instanceof Error ? error.message : String(error) }
		}
	}

	#execute(
		operation: AdapterOperation,
		arguments_: unknown[],
		selection: PersistenceSelection
	) {
		const ownerPersistence = this.#ownerPersistence
		if (ownerPersistence === undefined)
			return Promise.reject(new Error('SQLite persistence owner is unavailable'))

		const execute = () => {
			const selectedPersistence = selection?.type === 'collection'
				? ownerPersistence.resolvePersistenceForCollection?.(selection.options)
					?? ownerPersistence.resolvePersistenceForMode?.(selection.options.mode)
					?? ownerPersistence
				: selection?.type === 'mode'
					? ownerPersistence.resolvePersistenceForMode?.(selection.mode)
						?? ownerPersistence
					: ownerPersistence
			const operationMethod = selectedPersistence.adapter[operation]
			return operationMethod === undefined ?
				Promise.resolve(undefined)
			:
				Promise.resolve(Reflect.apply(
					operationMethod,
					selectedPersistence.adapter,
					arguments_
				))
		}
		const queued = this.#ownerQueue.then(execute, execute)
		this.#ownerQueue = queued.then(() => undefined, () => undefined)
		return queued
	}

	#replayPendingLocally() {
		for (const pending of this.#pending.values()) {
			clearInterval(pending.timer)
			void this.#execute(
				pending.operation,
				pending.arguments,
				pending.selection
			).then(
				(result) => pending.deferred.resolve(result),
				(error) => pending.deferred.reject(error)
			)
		}
	}

	#setPhase(phase: BrowserPersistencePhase) {
		this.#phase = phase
		for (const subscriber of this.#phaseSubscribers) subscriber(phase)
	}

	#settleReady(error?: unknown) {
		if (this.#readySettled) return
		this.#readySettled = true
		if (this.#bootstrapTimeout !== undefined) clearTimeout(this.#bootstrapTimeout)
		if (error === undefined) this.#readyDeferred.resolve()
		else this.#readyDeferred.reject(error)
	}
}
