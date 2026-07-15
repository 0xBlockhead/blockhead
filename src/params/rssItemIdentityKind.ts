import type { ParamMatcher } from '@sveltejs/kit'


export const match = ((param: string) => (
	param === 'Guid'
	|| param === 'Link'
)) satisfies ParamMatcher
