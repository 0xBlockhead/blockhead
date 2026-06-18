import type { ParamMatcher } from '@sveltejs/kit'

import { matchDecimalNonNegativeIntegerParam } from '$/schema/$params.ts'


export const match = ((param: string) => (
	matchDecimalNonNegativeIntegerParam(param)
)) satisfies ParamMatcher
