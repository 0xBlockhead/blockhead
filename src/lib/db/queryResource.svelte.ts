// Types/constants
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
const withResolvers = <T>() => {
	let resolve!: (value: T | PromiseLike<T>) => void
	let reject!: (reason?: unknown) => void
	const promise = new Promise<T>((res, rej) => {
		resolve = res
		reject = rej
	})
	return { promise, resolve, reject }
}

/**
 * Thenable reactive resource driven by an external sync (e.g. TanStack `useLiveQuery`).
 *
 * Modeled on {@link https://github.com/sveltejs/kit/blob/main/packages/kit/src/runtime/client/remote-functions/query.svelte.js SvelteKit}'s internal `Query`.
 * Instead of an async `#fn`, feed it snapshots via {@link QueryResource.applySync}.
 */
export class QueryResource<Data> {
	#raw = $state.raw<Data | undefined>(undefined)
	#error = $state.raw<unknown>(undefined)
	#ready = $state(false)
	#loading = $state(true)
	#promise = $state.raw<Promise<void> | null>(null)
	#pending: { resolve: (v: undefined) => void, reject: (e: unknown) => void } | null = null

	#current = $derived(this.#ready ? this.#raw : undefined)

	#then = $derived.by(() => {
		void untrack(() => (this.#promise ??= this.#newPromise()))
		const p = this.#promise!

		return <R1 = Data, R2 = never>(
			onFulfilled?: (value: Data) => R1 | PromiseLike<R1>,
			onRejected?: (reason: unknown) => R2 | PromiseLike<R2>,
		): Promise<R1 | R2> => (
			p
				.then(tick)
				.then(() => {
					const v = this.#current
					if (v === undefined) throw new Error('QueryResource settled without data')
					return v
				})
				.then(onFulfilled, onRejected)
		)
	})

	#newPromise() {
		const { promise, resolve, reject } = withResolvers<void>()
		this.#pending = { resolve, reject }
		return promise
	}

	/**
	 * Apply an external snapshot.
	 * - `pending: true` opens a new promise if none is pending (starts loading).
	 * - `error !== undefined` settles with rejection.
	 * - Otherwise settles with `data`.
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
			if (this.#ready || !this.#promise) {
				untrack(() => (this.#ready = false))
				this.#promise = this.#newPromise()
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
		p?.resolve(undefined)
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
		return <R = never>(onRejected?: (reason: unknown) => R | PromiseLike<R>) => (
			this.#then(undefined, onRejected)
		)
	}

	get finally() {
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

	$effect(() => {
		const query = getQuery()

		resource.applySync({
			data: query.data,
			error: query.isError ? (query.error ?? new Error(String(query.status ?? 'Query failed'))) : undefined,
			pending: (
				!query.isError && (
					typeof query.isReady === 'boolean' ?
						query.isLoading || !query.isReady
					:
						query.isLoading
				)
			),
		})
	})

	return resource
}
