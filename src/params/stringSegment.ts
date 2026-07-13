import type { ParamMatcher } from '@sveltejs/kit'


export const match = ((param: string) => (
	param.length > 0
)) satisfies ParamMatcher
