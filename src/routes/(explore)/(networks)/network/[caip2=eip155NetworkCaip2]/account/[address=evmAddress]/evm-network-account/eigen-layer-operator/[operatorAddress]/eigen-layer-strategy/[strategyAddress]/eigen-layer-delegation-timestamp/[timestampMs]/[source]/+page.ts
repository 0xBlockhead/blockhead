import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/EigenLayerDelegation_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$staker': {
				'$network': {
					caip2: caip2ParamValueFromString(params.caip2),
				},
				'$actor': {
					address: decodeURIComponent(params.address),
				},
			},
			'$operator': {
				'$network': {
					caip2: caip2ParamValueFromString(params.caip2),
				},
				operatorAddress: decodeURIComponent(params.operatorAddress),
			},
			'$strategy': {
				'$network': {
					caip2: caip2ParamValueFromString(params.caip2),
				},
				strategyAddress: decodeURIComponent(params.strategyAddress),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid EigenLayerDelegation_Timestamp selector')

	return { selector }
}
