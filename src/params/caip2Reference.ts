import type { ParamMatcher } from '@sveltejs/kit'


export const match = ((param: string) => (
	/^[-_a-zA-Z0-9]{1,32}$/.test(param)
)) satisfies ParamMatcher
