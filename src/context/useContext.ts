import { getContext, hasContext, setContext } from 'svelte'

export type ContextKey = string | symbol

export function useContext<_Value>(key: ContextKey, getInitialValue?: () => _Value): _Value
export function useContext<_Value>(key: ContextKey): _Value | undefined
export function useContext<_Value>(
	key: ContextKey,
	getInitialValue?: () => _Value
): _Value | undefined {
	return (
		hasContext(key) ?
			getContext<_Value>(key)
		: getInitialValue ?
			getInitialValue()
		:
			undefined
	)
}

export const useGetSetContext = <_Value>(
	key: ContextKey,
	getInitialValue?: () => _Value
) => ({
	get: () => useContext<_Value>(key, getInitialValue),
	set: (value: _Value) => setContext(key, value),
})
