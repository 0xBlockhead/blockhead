import { tick } from 'svelte'


type ResourceLike<_Value> = Promise<_Value> & {
	readonly current: _Value | undefined
	readonly loading: boolean
	readonly error: object | string | undefined
	readonly ready: boolean
}


/**
 * Transforms the value of a RemoteResource when it becomes ready.
 * Named `derive` instead of `then` to avoid module thenable detection issues during SSR.
 */
export const derive = <_Value, _Result>(
	resource: ResourceLike<_Value>,
	transform: (value: _Value) => _Result
): ResourceLike<_Result> => {
	return {
		get current() {
			return resource.current !== undefined ? transform(resource.current) : undefined
		},

		get loading() {
			return resource.current === undefined && resource.loading
		},

		get error() {
			return resource.error
		},

		get ready() {
			return resource.current !== undefined || resource.ready
		},

		get then() {
			const promise = resource.current !== undefined ?
				Promise.resolve(transform(resource.current))
			:
				resource.then(async (value) => {
					await tick()
					return transform(value)
				})
			return promise.then.bind(promise)
		},

		get catch() {
			const promise = resource.current !== undefined ?
				Promise.resolve(transform(resource.current))
			:
				resource.then(async (value) => {
					await tick()
					return transform(value)
				})
			return promise.catch.bind(promise)
		},

		get finally() {
			const promise = resource.current !== undefined ?
				Promise.resolve(transform(resource.current))
			:
				resource.then(async (value) => {
					await tick()
					return transform(value)
				})
			return promise.finally.bind(promise)
		},

		[Symbol.toStringTag]: 'RemoteResource',
	}
}
