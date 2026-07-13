import type { ParamMatcher } from '@sveltejs/kit'


export const match = ((param: string) => (
	param === 'native'
)) satisfies ParamMatcher
