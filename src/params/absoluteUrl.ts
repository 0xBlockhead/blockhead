import type { ParamMatcher } from '@sveltejs/kit'


export const match = ((param: string) => {
	try {
		return URL.canParse(decodeURIComponent(param))
	} catch {
		return false
	}
}) satisfies ParamMatcher
