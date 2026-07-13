import type { ParamMatcher } from '@sveltejs/kit'

export const match = ((param: string) => /^[1-9A-HJ-NP-Za-km-z]{32,}$/.test(param)) satisfies ParamMatcher
