import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/DydxChainSubaccount.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
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
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid DydxChainSubaccount selector')

	return { selector }
}
