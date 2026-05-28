import type { ParamMatcher } from '@sveltejs/kit'


export const match = ((param: string) => param === 'eip155') satisfies ParamMatcher
