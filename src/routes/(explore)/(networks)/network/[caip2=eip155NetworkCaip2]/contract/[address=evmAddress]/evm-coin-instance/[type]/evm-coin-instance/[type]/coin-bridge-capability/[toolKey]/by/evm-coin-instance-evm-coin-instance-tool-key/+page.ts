import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/CoinBridgeCapability.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$fromInstance': {
				'$network': {
					caip2: caip2ParamValueFromString(params.caip2),
				},
				'$contract': {
					'$network': {
						caip2: caip2ParamValueFromString(params.caip2),
					},
					address: decodeURIComponent(params.address),
				},
				type: decodeURIComponent(params.type),
			},
			'$toInstance': {
				'$network': {
					caip2: caip2ParamValueFromString(params.caip2),
				},
				type: decodeURIComponent(params.type),
			},
			toolKey: decodeURIComponent(params.toolKey),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid CoinBridgeCapability selector')

	return { selector }
}
