import type { ParamMatcher } from '@sveltejs/kit'

import { matchSchemaPrimitiveParam } from '$/schema/$params.ts'
import { EntityType } from '$/schema/EntityType.ts'


export const match = ((param: string) => (
	matchSchemaPrimitiveParam(
		EntityType.Network,
		'slug',
		param
	)
)) satisfies ParamMatcher
