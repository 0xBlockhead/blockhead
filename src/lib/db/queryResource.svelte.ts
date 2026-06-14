import type { RemoteResource } from '@sveltejs/kit'
import type { UseLiveQueryReturn } from '@tanstack/svelte-db'

import { tick, untrack } from 'svelte'
import { createSubscriber } from 'svelte/reactivity'


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
	#subscribe: () => void
	#loading = $state(true)
	#ready = $state(false)
	#current = $state.raw<Data | undefined>()
	#error = $state.raw<QueryResourceError | undefined>()
	#promise = $state.raw<Promise<Data> | null>(null)
	#resolve: ((value: Data) => void) | undefined
	#reject: ((error: QueryResourceError) => void) | undefined

	#then(): Promise<Data>['then'] {
		const activePromise = this.#getPromise()

		return (onFulfilled, onRejected) => {
			const result = activePromise.then(async (value) => {
				await tick()
				return this.#current ?? value
			})

			return result.then(onFulfilled, onRejected)
		}
	}

	constructor(
		query: () => TanStackLiveQuerySnapshot<Data>,
		subscribeToSource: (update: () => void) => () => void = () => () => {},
	) {
		this.#query = query
		this.#subscribe = createSubscriber(() => subscribeToSource(() => {
			untrack(() => {
				this.#apply(this.#query())
			})
		}))
		untrack(() => {
			this.#apply(this.#query())
		})
	}

	#startPending() {
		this.#promise = new Promise<Data>((resolve, reject) => {
			this.#resolve = resolve
			this.#reject = reject
		})
		this.#promise.catch(() => {})
		return this.#promise
	}

	#apply(
		snapshot: TanStackLiveQuerySnapshot<Data>,
	) {
		if (snapshot.isError) {
			this.fail(snapshot.error ?? String(snapshot.status))
			return
		}

		if (snapshot.isLoading || snapshot.isReady === false) {
			this.#loading = true
			this.#error = undefined

			if (!this.#promise || this.#ready)
				this.#startPending()

			return
		}

		this.set(snapshot.data)
	}

	#getPromise() {
		return untrack(() => {
			this.#apply(this.#query())
			return this.#promise ?? this.#startPending()
		})
	}

	#start() {
		void tick().then(() => this.#getPromise())
	}

	get then(): Promise<Data>['then'] {
		this.#subscribe()
		this.#start()
		return this.#then()
	}

	get catch(): Promise<Data>['catch'] {
		this.#subscribe()
		this.#start()
		return (
			onRejected,
		) => this.#then()(undefined, onRejected)
	}

	get finally(): Promise<Data>['finally'] {
		this.#subscribe()
		this.#start()
		return (
			onFinally?: (() => void) | null,
		) => this.#then()(
			(value) => {
				onFinally?.()
				return value
			},
			(error) => {
				onFinally?.()
				throw error
			},
		)
	}

	get current() {
		this.#subscribe()
		this.#start()
		return this.#current
	}

	get error() {
		this.#subscribe()
		this.#start()
		return this.#error
	}

	get loading() {
		this.#subscribe()
		this.#start()
		return this.#loading
	}

	get ready() {
		this.#subscribe()
		this.#start()
		return this.#ready
	}

	set(
		value: Data,
	) {
		this.#current = value
		this.#error = undefined
		this.#loading = false
		this.#ready = true
		this.#resolve?.(value)
		this.#resolve = undefined
		this.#reject = undefined
		this.#promise = Promise.resolve(value)
	}

	fail(
		error: QueryResourceError,
	) {
		this.#error = error
		this.#loading = false
		this.#reject?.(error)
		this.#resolve = undefined
		this.#reject = undefined
		this.#promise = Promise.reject(error)
		this.#promise.catch(() => {})
	}

	get [Symbol.toStringTag]() {
		return 'Query'
	}
}
