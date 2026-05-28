import type { RemoteResource } from '@sveltejs/kit'
import { tick } from 'svelte'


// ============================================================================
// PROMISE-LIKE HELPERS
// ============================================================================

/**
 * Transforms the value of a RemoteResource when it becomes ready.
 * Named `derive` instead of `then` to avoid module thenable detection issues during SSR.
 */
export const derive = <_Value, _Result>(
	resource: RemoteResource<_Value>,
	transform: (value: _Value) => Awaited<_Result>
): RemoteResource<_Result> => {
	const current = $derived(
		resource.ready ? transform(resource.current) : undefined
	)

	const promise = $derived(
		resource.then(async (value) => {
			await tick()
			return transform(value)
		})
	)

	// @ts-expect-error current
	return {
		get current() {
			return current
		},

		get loading() {
			return resource.loading
		},

		get error() {
			return resource.error
		},

		get ready() {
			return resource.ready
		},

		get then() {
			return promise.then.bind(promise)
		},

		get catch() {
			return promise.catch.bind(promise)
		},

		get finally() {
			return promise.finally.bind(promise)
		},

		[Symbol.toStringTag]: 'RemoteResource',
	}
}

// ============================================================================
// ARRAY HELPERS
// ============================================================================

/**
 * Maps over an array of RemoteResources, transforming each resolved value.
 */
export const map = <_Value, _Result>(
	resources: RemoteResource<_Value>[],
	transform: (value: _Value, index: number) => _Result
): RemoteResource<_Result[]> => {
	const current = $derived.by(() => {
		const results: _Result[] = []
		for (const [i, resource] of resources.entries()) {
			if (resource.ready) results.push(transform(resource.current, i))
		}
		return results
	})

	const ready = $derived(
		resources.every(resource => resource.ready)
	)

	const loading = $derived(
		resources.some(resource => resource.loading)
	)

	const errors = $derived(
		resources.map(resource => resource.error).filter(Boolean)
	)

	const error = $derived(
		errors.length > 0 ? errors : undefined
	)

	const promise = $derived(
		Promise.all(resources)
			.then(tick)
			.then(() => current)
	)

	// @ts-expect-error current
	return {
		get current() {
			return current
		},

		get loading() {
			return loading
		},

		get error() {
			return error
		},

		get ready() {
			return ready
		},

		get then() {
			return promise.then.bind(promise)
		},

		get catch() {
			return promise.catch.bind(promise)
		},

		get finally() {
			return promise.finally.bind(promise)
		},

		[Symbol.toStringTag]: 'RemoteResource',
	}
}

/**
 * Filters an array of RemoteResources based on their resolved values.
 */
export const filter = <_Value>(
	resources: RemoteResource<_Value>[],
	predicate: (value: _Value, index: number) => boolean
): RemoteResource<_Value[]> => {
	const current = $derived.by(() => {
		const results: _Value[] = []
		for (let i = 0; i < resources.length; i++) {
			const resource = resources[i]
			if (resource.ready && predicate(resource.current, i)) results.push(resource.current)
		}
		return results
	})

	const ready = $derived(
		resources.every(resource => resource.ready)
	)

	const loading = $derived(
		resources.some(resource => resource.loading)
	)

	const errors = $derived(
		resources.map(resource => resource.error).filter(Boolean)
	)

	const error = $derived(
		errors.length > 0 ? errors : undefined
	)

	const promise = $derived(
		Promise.all(resources)
			.then(tick)
			.then(() => current)
	)

	// @ts-expect-error current
	return {
		get current() {
			return current
		},

		get loading() {
			return loading
		},

		get error() {
			return error
		},

		get ready() {
			return ready
		},

		get then() {
			return promise.then.bind(promise)
		},

		get catch() {
			return promise.catch.bind(promise)
		},

		get finally() {
			return promise.finally.bind(promise)
		},

		[Symbol.toStringTag]: 'RemoteResource',
	}
}

/**
 * Reduces an array of RemoteResources to a single value.
 */
export const reduce = <_Value, _Accumulator>(
	resources: RemoteResource<_Value>[],
	reducer: (accumulator: _Accumulator, value: _Value, index: number) => _Accumulator,
	initialValue: _Accumulator
): RemoteResource<_Accumulator> => {
	const current = $derived.by(() => {
		let accumulator = initialValue
		for (const [i, resource] of resources.entries()) {
			if (resource.ready) accumulator = reducer(accumulator, resource.current, i)
		}
		return accumulator
	})

	const ready = $derived(
		resources.every(resource => resource.ready)
	)

	const loading = $derived(
		resources.some(resource => resource.loading)
	)

	const errors = $derived(
		resources.map(resource => resource.error).filter(Boolean)
	)

	const error = $derived(
		errors.length > 0 ? errors : undefined
	)

	const promise = $derived(
		Promise.all(resources)
			.then(tick)
			.then(() => current)
	)

		// @ts-expect-error derived readiness is tracked at runtime
		return {
			get current() {
				return current
			},

		get loading() {
			return loading
		},

		get error() {
			return error
		},

		get ready() {
			return ready
		},

		get then() {
			return promise.then.bind(promise)
		},

		get catch() {
			return promise.catch.bind(promise)
		},

		get finally() {
			return promise.finally.bind(promise)
		},

		[Symbol.toStringTag]: 'RemoteResource',
	}
}

/**
 * Maps each resolved value to an array and flattens the results.
 */
export const flatMap = <_Value, _Result>(
	resources: RemoteResource<_Value>[],
	transform: (value: _Value, index: number) => _Result[]
): RemoteResource<_Result[]> => {
	const current = $derived.by(() => {
		const results: _Result[] = []
		for (const [i, resource] of resources.entries()) {
			if (resource.ready) results.push(...transform(resource.current, i))
		}
		return results
	})

	const ready = $derived(
		resources.every(resource => resource.ready)
	)

	const loading = $derived(
		resources.some(resource => resource.loading)
	)

	const errors = $derived(
		resources.map(resource => resource.error).filter(Boolean)
	)

	const error = $derived(
		errors.length > 0 ? errors : undefined
	)

	const promise = $derived(
		Promise.all(resources)
			.then(tick)
			.then(() => current)
	)

	// @ts-expect-error current
	return {
		get current() {
			return current
		},

		get loading() {
			return loading
		},

		get error() {
			return error
		},

		get ready() {
			return ready
		},

		get then() {
			return promise.then.bind(promise)
		},

		get catch() {
			return promise.catch.bind(promise)
		},

		get finally() {
			return promise.finally.bind(promise)
		},

		[Symbol.toStringTag]: 'RemoteResource',
	}
}

// ============================================================================
// UTILITY HELPERS
// ============================================================================


// ============================================================================
// PROXY HELPERS
// ============================================================================

const remoteResourceProperties = new Set([
	'current',
	'loading',
	'ready',
	'error',
	'then',
	'catch',
	'finally',
	Symbol.toStringTag,
	Symbol.toPrimitive,
])

/**
 * A proxied RemoteResource that allows accessing properties on the resource's value.
 * When accessing a property that isn't a RemoteResource property, it returns a proxied RemoteResource
 * for that property's value.
 */
export type ProxiedRemoteResource<_Value> = (
	RemoteResource<_Value>
	& (
		_Value extends object ?
			{
				[K in keyof _Value as K extends keyof RemoteResource<_Value> ? never : K]: (
					ProxiedRemoteResource<_Value[K]>
				)
			}
		:
			{}
	)
)

/**
 * Creates a proxy for a RemoteResource that allows accessing properties on the resource's value.
 * When accessing a property that isn't a RemoteResource property, it returns a proxied RemoteResource
 * for that property's value.
 */
export const proxy = <_Value>(
	resource: RemoteResource<_Value>
): ProxiedRemoteResource<_Value> => (
	Proxy.revocable(
		resource,
		{
			get(target, property, receiver) {
				if (remoteResourceProperties.has(property)){
					// Proxy `get` trap: delegate to `target` for built-in `RemoteResource` keys (spec-correct forwarding).
					const value = Reflect.get(target, property, receiver)

					return (
						typeof value === 'function' ?
							value.bind(target)
						:
							value
					)
				}

				return proxy(
					derive(
						target,
						(value: _Value) => (
							value[property as keyof _Value] as Awaited<_Value[keyof _Value]>
						)
					)
				)
			}
		}
	)
		.proxy
)
