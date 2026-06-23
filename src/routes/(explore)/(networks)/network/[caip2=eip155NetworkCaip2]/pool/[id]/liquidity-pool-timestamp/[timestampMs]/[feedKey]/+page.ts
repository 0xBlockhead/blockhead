import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/LiquidityPool_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$liquidityPool': {
				'$network': {
					caip2: caip2ParamValueFromString(params.caip2),
				},
				id: decodeURIComponent(params.id),
			},
			timestampMs: Number(params.timestampMs),
			feedKey: decodeURIComponent(params.feedKey),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid LiquidityPool_Timestamp selector')

	return { selector }
}
