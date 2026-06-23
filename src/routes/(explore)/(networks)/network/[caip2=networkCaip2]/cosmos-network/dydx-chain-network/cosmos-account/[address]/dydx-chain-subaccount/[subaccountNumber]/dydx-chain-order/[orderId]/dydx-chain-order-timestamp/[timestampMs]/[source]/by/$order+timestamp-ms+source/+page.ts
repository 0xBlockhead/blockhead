import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/DydxChainOrder_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$order': {
				'$subaccount': {
					'$network': {
						'$network': {
							'$network': {
								caip2: caip2ParamValueFromString(params.caip2),
							},
						},
					},
					'$account': {
						'$network': {
							caip2: caip2ParamValueFromString(params.caip2),
						},
						address: decodeURIComponent(params.address),
					},
					subaccountNumber: decodeURIComponent(params.subaccountNumber),
				},
				orderId: decodeURIComponent(params.orderId),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid DydxChainOrder_Timestamp selector')

	return { selector }
}
