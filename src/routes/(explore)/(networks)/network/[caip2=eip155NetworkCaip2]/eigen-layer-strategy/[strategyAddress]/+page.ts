import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/EigenLayerStrategy.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$network': {
				caip2: caip2ParamValueFromString(params.caip2),
			},
			strategyAddress: decodeURIComponent(params.strategyAddress),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid EigenLayerStrategy selector')

	return { selector }
}
