import type { RemoteResource } from '@sveltejs/kit'
import type { UseLiveQueryReturn } from '@tanstack/svelte-db'

import {
	tick,
	untrack,
} from 'svelte'
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
	#sourceUnsubscribe: (() => void) | undefined
	#sourceReferenceCount = 0
	#sourceUpdates = new Set<() => void>()
	#track = createSubscriber((update) => this.#acquireSource(update))
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
		this.#raw
		return (onFulfilled, onRejected) => {
			const releaseSource = this.#acquireSource()
			const result = promise.then(tick).then(() => {
				if (!this.#ready || this.#raw === undefined)
					throw new Error('TanStackLiveQueryResource resolved before current value was available')

				return this.#raw.value
			}).finally(releaseSource)

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

	#acquireSource(update?: () => void) {
		this.#sourceReferenceCount += 1
		if (update != null)
			this.#sourceUpdates.add(update)
		if (this.#sourceUnsubscribe === undefined)
			this.#sourceUnsubscribe = this.#subscribeToSource(() => {
				untrack(() => {
					this.#apply(this.#query())
				})
				for (const sourceUpdate of this.#sourceUpdates)
					sourceUpdate()
			})

		let released = false
		return () => {
			if (released)
				return

			released = true
			this.#sourceReferenceCount -= 1
			if (update != null)
				this.#sourceUpdates.delete(update)
			if (this.#sourceReferenceCount === 0) {
				this.#sourceUnsubscribe?.()
				this.#sourceUnsubscribe = undefined
			}
		}
	}

	#start() {
		if (this.#started)
			return

		this.#started = true
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

	#read() {
		const started = this.#started
		this.#start()
		this.#track()
		if (
			started
			&& this.#sourceReferenceCount === 0
		)
			untrack(() => {
				this.#apply(this.#query())
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
			if (snapshot.data === undefined) {
				this.#ready = false
				this.#raw = undefined
			}
			if (
				!this.#ready
				&& !this.#pending
			)
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
		this.#track()
		return this.#then
	}

	get catch(): Promise<Data>['catch'] {
		this.#start()
		this.#track()
		this.#then
		return (
			onRejected
		) => this.#then(undefined, onRejected)
	}

	get finally(): Promise<Data>['finally'] {
		this.#start()
		this.#track()
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
		this.#read()
		return this.#current
	}

	get error() {
		this.#read()
		return this.#error
	}

	get loading() {
		this.#read()
		return this.#loading
	}

	get ready() {
		this.#read()
		return this.#ready
	}

	subscribe(
		update: () => void
	) {
		return this.#acquireSource(update)
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
