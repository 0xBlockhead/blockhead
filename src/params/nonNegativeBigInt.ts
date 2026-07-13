import type { ParamMatcher } from '@sveltejs/kit'

import { matchDecimalNonNegativeBigIntParam } from '$/schema/$params.ts'


export const match = ((param: string) => matchDecimalNonNegativeBigIntParam(param)) satisfies ParamMatcher
