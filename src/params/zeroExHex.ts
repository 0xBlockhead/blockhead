import type { ParamMatcher } from '@sveltejs/kit'


export const match = ((param: string) => (
	/^0x[0-9a-fA-F]+$/.test(param)
)) satisfies ParamMatcher
