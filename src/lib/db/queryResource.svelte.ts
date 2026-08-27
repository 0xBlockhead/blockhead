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
	readonly [Symbol.toStringTag]?: undefined
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
	#ready = $derived(this.#raw !== undefined)
	#current = $derived(this.#raw?.value)
	#error = $state.raw<QueryResourceError | undefined>()
	#promise: Promise<void>
	#started = false
	#destroyed = false

	#then = $derived.by((): Promise<Data>['then'] => {
		const promise = this.#promise
		this.#raw
		return (onFulfilled, onRejected) => {
			const result = promise.then(tick).then(() => {
				if (this.#raw === undefined)
					throw new Error('TanStackLiveQueryResource resolved before current value was available')

				return this.#raw.value
			})

			return result.then(onFulfilled, onRejected)
		}
	})

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
		if (this.#destroyed)
			return

		try {
			untrack(() => {
				this.#apply(this.#query())
			})
		} catch (error) {
			this.fail(error instanceof Error ? error : String(error))
		}
	}

	#start() {
		if (
			this.#destroyed
			|| this.#started
		)
			return

		this.#started = true
		void tick()
			.then(() => {
				if (this.#destroyed)
					return

				this.#unsubscribe = this.#subscribeToSource(this.#update)
				return this.#initialize?.()
			})
			.then(this.#update)
			.catch((error) => {
				if (!this.#destroyed)
					this.fail(error instanceof Error ? error : String(error))
			})
	}

	destroy() {
		if (this.#destroyed)
			return

		this.#destroyed = true
		this.#unsubscribe?.()
		this.#unsubscribe = undefined
	}

	#apply(
		snapshot: TanStackLiveQuerySnapshot<Data>
	) {
		if (snapshot.isError) {
			this.fail(snapshot.error ?? String(snapshot.status))
			return
		}

		if (
			snapshot.isLoading
			|| snapshot.isReady === false
		) {
			const hadError = this.#error !== undefined
			this.#loading = true
			this.#error = undefined
			if (snapshot.data === undefined) {
				this.#raw = undefined
			}
			if (
				(
					!this.#ready
					|| hadError
				)
				&& !this.#pending
			)
				this.#resetPending()

			return
		}

		this.set(snapshot.data)
	}

	#resetPending() {
		this.#pending = Promise.withResolvers<void>()
		this.#promise = this.#pending.promise
		this.#promise.catch(() => {})
	}

	get then(): Promise<Data>['then'] {
		this.#start()
		return this.#then
	}

	get catch(): Promise<Data>['catch'] {
		this.#start()
		this.#then
		return (
			onRejected
		) => this.#then(undefined, onRejected)
	}

	get finally(): Promise<Data>['finally'] {
		this.#start()
		this.#then
		return (onFinally) => this.#then().finally(onFinally)
	}

	get current() {
		this.#start()
		return this.#current
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
		return this.#ready
	}

	set(
		value: Data
	) {
		this.#loading = false
		this.#error = undefined
		this.#raw = {
			value,
		}

		this.#pending?.resolve()
		this.#pending = undefined
		this.#promise = Promise.resolve()
	}

	fail(
		error: QueryResourceError
	) {
		this.#error = error
		this.#loading = false
		if (this.#pending !== undefined) {
			this.#pending.reject(error)
			this.#pending = undefined
		} else {
			this.#promise = Promise.reject(error)
			this.#promise.catch(() => {})
		}
	}

	get [Symbol.toStringTag]() {
		return 'LiveQuery'
	}
}
