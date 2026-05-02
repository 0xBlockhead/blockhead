import type { ParamMatcher } from '@sveltejs/kit'


export const match = ((param: string) => (
	param.length > 0
	&& param.length < 12_000
)) satisfies ParamMatcher
