import type { ParamMatcher } from '@sveltejs/kit'

import { Iso4217 } from '$/constants/Currency.ts'


export const match: ParamMatcher = (param) => (
	Object.values(Iso4217).includes(param as Iso4217)
)
