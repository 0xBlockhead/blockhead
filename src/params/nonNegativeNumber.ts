import type { ParamMatcher } from '@sveltejs/kit'


export const match = ((param: string) => (
	/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(param)
)) satisfies ParamMatcher
