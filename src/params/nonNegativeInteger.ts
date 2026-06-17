import type { ParamMatcher } from '@sveltejs/kit'


export const match = ((param: string) => (
	/^(0|[1-9]\d*)$/.test(param)
	&& Number.isSafeInteger(Number(param))
)) satisfies ParamMatcher
