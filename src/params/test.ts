import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is ('test') => {
	return param === 'test'
}) satisfies ParamMatcher
