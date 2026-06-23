import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/EvmNetworkActorCoinBalance_EvmBlock.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$actorCoin': {
				'$actor': {
					address: decodeURIComponent(params.address),
					interopAddress: decodeURIComponent(params.interopAddress),
				},
				'$network': {
					caip2: caip2ParamValueFromString(params.caip2),
				},
			},
			'$block': {
				'$network': {
					caip2: caip2ParamValueFromString(params.caip2),
				},
				hash: decodeURIComponent(params.hash),
			},
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid EvmNetworkActorCoinBalance_EvmBlock selector')

	return { selector }
}
