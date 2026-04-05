/**
 * Stub for `bun:ffi` when running under Node/Vite SSR so `@tevm/voltaire` can load.
 * Aliased from `vite.config.ts` (same idea as ethglobal-hackmoney-2026).
 */
const stub = Symbol('stub')
export const FFIType = {
	cstring: stub,
	ptr: stub,
	i32: stub,
	u64: stub,
	bool: stub,
	void: stub,
}
export function dlopen() {
	return { symbols: {} }
}
