import { stringify } from 'devalue'

type FlightFn = (...args: unknown[]) => Promise<unknown>

const cacheByFn = new WeakMap<FlightFn, Map<string, Promise<unknown>>>()

export const singleFlight = <
	_Arguments extends unknown[],
	_Result,
>(
	fn: (...args: _Arguments) => Promise<_Result>,
): typeof fn => {
	const keyFn = fn as FlightFn
	return ((...args: _Arguments) => {
		let cache = cacheByFn.get(keyFn)
		if (cache == null) {
			cache = new Map()
			cacheByFn.set(keyFn, cache)
		}
		const key = stringify(args)
		const existing = cache.get(key)
		if (existing != null) return (existing as Promise<_Result>)
		const pending = (
			fn(...args)
				.finally(() => {
					cache.delete(key)
				})
		)
		cache.set(key, pending)
		return pending
	}) as typeof fn
}
