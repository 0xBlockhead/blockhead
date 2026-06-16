import type { RemoteResource } from '@sveltejs/kit'
import type { UseLiveQueryReturn } from '@tanstack/svelte-db'

import {
	flushSync,
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
	#unsubscribe: (() => void) | undefined
	#loading = $state(true)
	#ready = $state(false)
	#value = $state.raw<{ readonly value: Data } | undefined>()
	#current = $derived.by(() => (
		this.#ready ?
			this.#value?.value
		:
			undefined
	))
	#error = $state.raw<QueryResourceError | undefined>()
	#promise = $state.raw<Promise<Data> | null>(null)
	#version = $state({
		value: 0,
	})
	#resolve: ((value: Data) => void) | undefined
	#reject: ((error: QueryResourceError) => void) | undefined
	#pending = false
	#started = false

	#then = $derived.by((): Promise<Data>['then'] => {
		const promise = this.#getPromise()
		this.#version.value

		return (onFulfilled, onRejected) => {
			const result = promise.then(tick).then(() => {
				if (this.#value == null)
					throw new Error('TanStackLiveQueryResource resolved before current value was available')

				return this.#value.value
			})

			return result.then(onFulfilled, onRejected)
		}
	})

	constructor(
		query: () => TanStackLiveQuerySnapshot<Data>,
		subscribeToSource: (update: () => void) => () => void = () => () => {}
	) {
		this.#query = query
		this.#subscribeToSource = subscribeToSource
		untrack(() => {
			this.#apply(this.#query())
		})
	}

	#subscribe() {
		this.#unsubscribe ??= this.#subscribeToSource(() => {
			flushSync(() => {
				this.#apply(this.#query())
			})
		})
	}

	#startPending() {
		this.#pending = true
		this.#promise = new Promise<Data>((resolve, reject) => {
			this.#resolve = resolve
			this.#reject = reject
		})
		this.#promise.catch(() => {})
		this.#version.value += 1
		return this.#promise
	}

	#apply(
		snapshot: TanStackLiveQuerySnapshot<Data>
	) {
		if (snapshot.isError) {
			this.fail(snapshot.error ?? String(snapshot.status))
			return
		}

		if (snapshot.isLoading || snapshot.isReady === false) {
			this.#loading = true
			this.#error = undefined

			if (!this.#pending)
				this.#startPending()

			return
		}

		this.set(snapshot.data)
	}

	#getPromise() {
		return untrack(() => this.#promise ?? this.#startPending())
	}

	#start() {
		if (this.#started)
			return

		this.#started = true
		void tick().then(() => {
			this.#apply(this.#query())
			this.#getPromise()
		})
	}

	get then(): Promise<Data>['then'] {
		this.#subscribe()
		this.#start()
		return this.#then
	}

	get catch(): Promise<Data>['catch'] {
		this.#subscribe()
		this.#start()
		return (
			onRejected
		) => this.#then(undefined, onRejected)
	}

	get finally(): Promise<Data>['finally'] {
		this.#subscribe()
		this.#start()
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
		this.#subscribe()
		this.#start()
		this.#version.value
		return this.#current
	}

	get error() {
		this.#subscribe()
		this.#start()
		this.#version.value
		return this.#error
	}

	get loading() {
		this.#subscribe()
		this.#start()
		this.#version.value
		return this.#loading
	}

	get ready() {
		this.#subscribe()
		this.#start()
		this.#version.value
		return this.#ready
	}

	set(
		value: Data
	) {
		this.#value = {
			value,
		}
		this.#error = undefined
		this.#loading = false
		this.#ready = true
		this.#pending = false
		this.#resolve?.(value)
		this.#resolve = undefined
		this.#reject = undefined
		this.#promise = Promise.resolve(value)
		this.#version.value += 1
	}

	fail(
		error: QueryResourceError
	) {
		this.#error = error
		this.#loading = false
		this.#pending = false
		this.#reject?.(error)
		this.#resolve = undefined
		this.#reject = undefined
		this.#promise = Promise.reject(error)
		this.#promise.catch(() => {})
		this.#version.value += 1
	}

	get [Symbol.toStringTag]() {
		return 'Query'
	}
}
