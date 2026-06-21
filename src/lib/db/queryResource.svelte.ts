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

const promiseWithResolvers = <Value>() => {
	let resolveValue: ((value: Value) => void) | undefined
	let rejectValue: ((error: QueryResourceError) => void) | undefined
	const promise = new Promise<Value>((resolve, reject) => {
		resolveValue = resolve
		rejectValue = reject
	})
	return {
		promise,
		resolve: (value: Value) => resolveValue?.(value),
		reject: (error: QueryResourceError) => rejectValue?.(error),
	}
}

export class TanStackLiveQueryResource<Data> implements SvelteKitResource<Data> {
	#query: () => TanStackLiveQuerySnapshot<Data>
	#subscribeToSource: (update: () => void) => () => void
	#initialize: (() => Promise<void>) | undefined
	#unsubscribe: (() => void) | undefined
	#first = promiseWithResolvers<void>()
	#loading = $state(true)
	#ready = $state(false)
	#raw = $state.raw<{ readonly value: Data } | undefined>()
	#current = $derived.by(() => (
		this.#ready ?
			this.#raw?.value
		:
			undefined
	))
	#error = $state.raw<QueryResourceError | undefined>()
	#promise = $state.raw(this.#first.promise)
	#resolveFirst: ((value: void) => void) | undefined = this.#first.resolve
	#rejectFirst: ((error: QueryResourceError) => void) | undefined = this.#first.reject
	#pending = true
	#started = false

	#then = $derived.by((): Promise<Data>['then'] => {
		const promise = this.#promise

		return (onFulfilled, onRejected) => {
			const result = promise.then(tick).then(() => {
				if (!this.#ready || this.#raw === undefined)
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
		this.#query = query
		this.#subscribeToSource = subscribeToSource
		this.#initialize = initialize
		this.#promise.catch(() => {})
	}

	#subscribe() {
		if (this.#unsubscribe !== undefined)
			return

		this.#unsubscribe = this.#subscribeToSource(() => {
			untrack(() => {
				this.#apply(this.#query())
			})
		})
	}

	#start() {
		if (this.#started)
			return

		this.#started = true
		this.#subscribe()
		void (this.#initialize?.() ?? Promise.resolve())
			.then(() => {
				untrack(() => {
					this.#apply(this.#query())
				})
			})
			.catch((error) => {
				this.fail(error instanceof Error ? error : String(error))
			})
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
			this.#loading = true
			this.#error = undefined
			if (!this.#pending)
				this.#resetPending()

			return
		}

		this.set(snapshot.data)
	}

	#resetPending() {
		this.#first = promiseWithResolvers<void>()
		this.#promise = this.#first.promise
		this.#promise.catch(() => {})
		this.#resolveFirst = this.#first.resolve
		this.#rejectFirst = this.#first.reject
		this.#pending = true
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
		return (
			onFinally?: (() => void) | null
		) => this.#then(
			(value) => {
				onFinally?.()
				return value
			},
			(error) => {
				onFinally?.()
				throw error
			}
		)
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
		this.#ready = true
		this.#loading = false
		this.#error = undefined
		this.#raw = {
			value,
		}

		if (this.#resolveFirst !== undefined) {
			this.#resolveFirst()
			this.#resolveFirst = undefined
			this.#rejectFirst = undefined
		} else
			this.#promise = Promise.resolve()

		this.#pending = false
	}

	fail(
		error: QueryResourceError
	) {
		this.#error = error
		this.#loading = false
		if (this.#rejectFirst !== undefined) {
			this.#rejectFirst(error)
			this.#resolveFirst = undefined
			this.#rejectFirst = undefined
		} else {
			this.#promise = Promise.reject(error)
			this.#promise.catch(() => {})
		}
		this.#pending = false
	}

	get [Symbol.toStringTag]() {
		return 'LiveQuery'
	}
}
