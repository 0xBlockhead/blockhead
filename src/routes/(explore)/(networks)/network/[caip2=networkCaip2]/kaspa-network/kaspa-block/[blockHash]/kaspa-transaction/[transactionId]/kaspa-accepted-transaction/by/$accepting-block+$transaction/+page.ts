import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/KaspaAcceptedTransaction.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$acceptingBlock': {
				'$network': {
					'$network': {
						caip2: caip2ParamValueFromString(params.caip2),
					},
				},
				blockHash: decodeURIComponent(params.blockHash),
			},
			'$transaction': {
				'$network': {
					'$network': {
						caip2: caip2ParamValueFromString(params.caip2),
					},
				},
				transactionId: decodeURIComponent(params.transactionId),
			},
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid KaspaAcceptedTransaction selector')

	return { selector }
}
