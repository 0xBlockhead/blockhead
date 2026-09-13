import type { RemoteResource } from '@sveltejs/kit'
import type { UseLiveQueryReturn } from '@tanstack/svelte-db'

import {
	tick,
	untrack,
} from 'svelte'


export type QueryResourceError = object | string

export type TanStackLiveQuerySnapshot<Data> = Pick<
	UseLiveQueryReturn<object, Data>,
	| 'data'
	| 'isLoading'
	| 'isReady'
	| 'isError'
	| 'status'
> & {
	error?: QueryResourceError
}

export type SvelteKitResource<Data> = Omit<
	RemoteResource<Data>,
	'error'
> & {
	error: QueryResourceError | undefined
}

export class TanStackLiveQueryResource<Data> implements SvelteKitResource<Data> {
	#query: () => TanStackLiveQuerySnapshot<Data>
	#subscribeToSource: (update: () => void) => () => void
	#initialize: (() => Promise<void>) | undefined
	#unsubscribe: (() => void) | undefined
	#pending: PromiseWithResolvers<void> | undefined
	#loading = $state(true)
	#raw = $state.raw<{ readonly value: Data } | undefined>()
	#error = $state.raw<QueryResourceError | undefined>()
	#promise: Promise<void>
	#lifecycle: 'idle' | 'started' | 'destroyed' = 'idle'

	constructor(
		query: () => TanStackLiveQuerySnapshot<Data>,
		subscribeToSource: (update: () => void) => () => void = () => () => {},
		initialize?: () => Promise<void>
	) {
		const pending = Promise.withResolvers<void>()
		this.#pending = pending
		this.#promise = $state.raw(pending.promise)
		this.#query = query
		this.#subscribeToSource = subscribeToSource
		this.#initialize = initialize
		this.#promise.catch(() => {})
	}

	#update = () => {
		if (this.#lifecycle === 'destroyed')
			return

		try {
			untrack(() => {
				const snapshot = this.#query()
				if (snapshot.isError) {
					this.fail(snapshot.error ?? snapshot.status)
					return
				}

				if (
					snapshot.isLoading
					|| !snapshot.isReady
				) {
					const hadError = this.#error !== undefined
					this.#loading = true
					this.#error = undefined
					if (snapshot.data === undefined)
						this.#raw = undefined

					if (
						(
							this.#raw === undefined
							|| hadError
						)
						&& !this.#pending
					) {
						this.#pending = Promise.withResolvers<void>()
						this.#promise = this.#pending.promise
						this.#promise.catch(() => {})
					}

					return
				}

				this.set(snapshot.data)
			})
		} catch (error) {
			this.fail(error instanceof Error ? error : String(error))
		}
	}

	#start() {
		if (this.#lifecycle !== 'idle')
			return

		this.#lifecycle = 'started'
		void tick()
			.then(() => {
				if (this.#lifecycle === 'destroyed')
					return

				this.#unsubscribe = this.#subscribeToSource(this.#update)
				return this.#initialize?.()
			})
			.then(this.#update)
			.catch((error) => {
				if (this.#lifecycle !== 'destroyed')
					this.fail(error instanceof Error ? error : String(error))
			})
	}

	destroy() {
		if (this.#lifecycle === 'destroyed')
			return

		this.#lifecycle = 'destroyed'
		this.#unsubscribe?.()
		this.#unsubscribe = undefined
	}

	get then(): Promise<Data>['then'] {
		this.#start()
		const trackedPromise = this.#promise
		void trackedPromise
		return (onFulfilled, onRejected) => {
			const read = async () => {
				for (;;) {
					const promise = this.#promise
					await promise
					await tick()
					if (promise !== this.#promise)
						continue

					if (this.#raw === undefined)
						throw new Error('TanStackLiveQueryResource resolved before current value was available')

					return this.#raw.value
				}
			}

			return read().then(onFulfilled, onRejected)
		}
	}

	get catch(): Promise<Data>['catch'] {
		this.then
		return (
			onRejected
		) => this.then(undefined, onRejected)
	}

	get finally(): Promise<Data>['finally'] {
		this.then
		return (onFinally) => this.then().finally(onFinally)
	}

	get current() {
		this.#start()
		return this.#raw?.value
	}

	get error() {
		this.#start()
		return this.#error
	}

	get loading() {
		this.#start()
		return this.#loading
	}

	get ready() {
		this.#start()
		return this.#raw !== undefined
	}

	set(
		value: Data
	) {
		this.#loading = false
		this.#error = undefined
		this.#raw = {
			value,
		}

		if (this.#pending)
			this.#pending.resolve()
		else
			this.#promise = Promise.resolve()

		this.#pending = undefined
	}

	fail(
		error: QueryResourceError
	) {
		this.#error = error
		this.#loading = false
		if (this.#pending)
			this.#pending.reject(error)
		else {
			this.#promise = Promise.reject(error)
			this.#promise.catch(() => {})
		}

		this.#pending = undefined
	}

	get [Symbol.toStringTag]() {
		return 'LiveQuery'
	}
}
