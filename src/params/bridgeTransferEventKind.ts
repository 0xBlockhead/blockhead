import type { ParamMatcher } from '@sveltejs/kit'


export const match = ((param: string) => (
	param === 'sourceTransaction'
	|| param === 'destinationTransaction'
)) satisfies ParamMatcher
