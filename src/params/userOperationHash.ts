import type { ParamMatcher } from '@sveltejs/kit'


/** `0x` + 64 hex digits (user-operation hash); accepts mixed case for URLs. */
export const match: ParamMatcher = (param) => (
	/^0x[0-9a-fA-F]{64}$/.test(param)
)
