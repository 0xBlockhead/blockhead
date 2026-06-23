import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/TezosBakingRight.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$network': {
				'$network': {
					caip2: caip2ParamValueFromString(params.caip2),
				},
			},
			cycle: decodeURIComponent(params.cycle),
			level: decodeURIComponent(params.level),
			rightKind: decodeURIComponent(params.rightKind),
			bakerAddress: decodeURIComponent(params.bakerAddress),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid TezosBakingRight selector')

	return { selector }
}
