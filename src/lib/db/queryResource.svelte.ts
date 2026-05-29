// Types/constants
import { normalizeBoundaryError } from '$/lib/errors.ts'
import type { RemoteResource } from '@sveltejs/kit'
import { tick, untrack } from 'svelte'


export type QueryLike<Data> = {
	data: Data
	isLoading: boolean
	isError: boolean
	/** When set, treat as pending while `!isReady` even if `isLoading` is false (TanStack live query hydration). */
	isReady?: boolean
	error?: unknown
	/** `useLiveQuery` exposes `status` but not `error`; use for fallback messaging */
	status?: string
}


// Functions
const withResolvers = () => {
	let resolve!: (value: void | PromiseLike<void>) => void
	let reject!: (reason?: unknown) => void
	const promise = new Promise<void>((res, rej) => {
		resolve = res
		reject = rej
	})
	return { promise, resolve, reject }
}


/**
 * Thenable reactive resource driven by an external sync (e.g. TanStack `useLiveQuery`).
 *
 * Mirrors {@link https://github.com/sveltejs/kit/blob/main/packages/kit/src/runtime/client/remote-functions/query.svelte.js SvelteKit `Query`}: `then` chains `p.then(tick).then(() => #current)` and settles the inner promise with `undefined` while data lives in `#raw` / `#current`.
 * Feed snapshots via {@link QueryResource.applySync} instead of an async `#fn`.
 */
export class QueryResource<Data> {
	#raw = $state.raw<Data | undefined>(undefined)
	#error = $state.raw<unknown>(undefined)
	#ready = $state(false)
	#loading = $state(true)
	#promise = $state.raw<Promise<void> | null>(null)
	#pending: { resolve: () => void, reject: (reason?: unknown) => void } | null = null

	#current = $derived(this.#ready ? this.#raw : undefined)

	#get_promise(): Promise<void> {
		void untrack(() => {
			if (this.#promise != null)
				return
			if (this.#ready) {
				this.#promise = Promise.resolve()
				return
			}
			const { promise, resolve, reject } = withResolvers()
			this.#pending = { resolve, reject }
			this.#promise = promise
		})
		return this.#promise!
	}

	#then = $derived.by(() => {
		const p = this.#get_promise()

		return (
			onFulfilled?: (value: Data) => unknown,
			onRejected?: (reason: unknown) => unknown,
		) => {
			const result = (
				p
					.then(tick)
					.then(() => this.#current as Data)
			)

			if (onFulfilled != null || onRejected != null) {
				return result.then(onFulfilled, onRejected)
			}

			return result
		}
	})

	/**
	 * Apply an external snapshot.
	 * - `pending: true` opens a new promise if none is pending (starts loading).
	 * - `error !== undefined` settles with rejection.
	 * - Otherwise settles with `undefined` after writing `data` (SvelteKit-style).
	 */
	applySync({
		data,
		error,
		pending,
	}: {
		data: Data
		error: unknown
		pending: boolean
	}) {
		if (pending) {
			this.#loading = true
			if (this.#ready || this.#promise == null) {
				untrack(() => {
					this.#ready = false
					const { promise, resolve, reject } = withResolvers()
					this.#pending = { resolve, reject }
					this.#promise = promise
				})
			}
			return
		}

		const p = this.#pending
		this.#pending = null

		if (error !== undefined) {
			untrack(() => {
				this.#error = error
				this.#loading = false
			})
			p?.reject(error)
			return
		}

		untrack(() => {
			this.#raw = data
			this.#error = undefined
			this.#ready = true
			this.#loading = false
		})
		p?.resolve()
	}

	get current() {
		return this.#current
	}

	get error() {
		return this.#error
	}

	get loading() {
		return this.#loading
	}

	get ready() {
		return this.#ready
	}

	get then() {
		return this.#then
	}

	get catch() {
		this.#then

		return <R = never>(onRejected?: (reason: unknown) => R | PromiseLike<R>) => (
			this.#then(undefined, onRejected)
		)
	}

	get finally() {
		this.#then

		return (fn?: () => void) => (
			this.#then(
				(value) => {
					fn?.()
					return value
				},
				(err) => {
					fn?.()
					throw err
				},
			)
		)
	}

	get [Symbol.toStringTag]() {
		return 'QueryResource'
	}
}


export const toQueryResource = <Data>(
	getQuery: () => QueryLike<Data>,
) => {
	const resource = new QueryResource<Data>()
	const query = getQuery()

	resource.applySync({
		data: query.data,
		error: (
			query.isError ?
				normalizeBoundaryError(query.error ?? new Error(String(query.status ?? 'Query failed')))
			: undefined
		),
		pending: (
			!query.isError && (
				query.isLoading
				|| query.isReady === false
			)
		),
	})

	$effect(() => {
		const query = getQuery()

		resource.applySync({
			data: query.data,
			error: (
				query.isError ?
					normalizeBoundaryError(query.error ?? new Error(String(query.status ?? 'Query failed')))
				: undefined
			),
			pending: (
				!query.isError && (
					query.isLoading
					|| query.isReady === false
				)
			),
		})
	})

	return resource
}


export const toQueryResourceFromRemote = <Data>(
	getRemote: () => RemoteResource<Data>,
) => {
	const resource = new QueryResource<Data>()
	const remoteResource = getRemote()
	const error = remoteResource.error

	resource.applySync({
		data: remoteResource.current as Data,
		error: error === undefined ? undefined : error,
		pending: (
			error === undefined
			&& !remoteResource.ready
		),
	})

	$effect(() => {
		const remoteResource = getRemote()
		const error = remoteResource.error

		resource.applySync({
			data: remoteResource.current as Data,
			error: error === undefined ? undefined : error,
			pending: (
				error === undefined
				&& !remoteResource.ready
			),
		})
	})

	return resource
}
