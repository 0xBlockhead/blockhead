import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/LitecoinMwebTransaction.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$mwebBlock': {
				'$block': {
					'$network': {
						caip2: caip2ParamValueFromString(params.caip2),
					},
					height: Number(params.height),
				},
			},
			transactionIndex: decodeURIComponent(params.transactionIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid LitecoinMwebTransaction selector')

	return { selector }
}
