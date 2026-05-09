import { stringify } from 'devalue'

import type { JsonValue } from '$/typescript/JsonValue.ts'

export const singleFlight = <
	_Arguments extends ReadonlyArray<JsonValue | undefined>,
	_Result,
>(
	fn: (...args: _Arguments) => Promise<_Result>,
): ((...args: _Arguments) => Promise<_Result>) => {
	const cache = new Map<string, Promise<_Result>>()
	return (...args: _Arguments): Promise<_Result> => {
		const key = stringify(args)
		const existing = cache.get(key)
		if (existing != null) return existing
		const pending = fn(...args).finally(() => {
			cache.delete(key)
		})
		cache.set(key, pending)
		return pending
	}
}
