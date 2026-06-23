import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/TonTransactionPhase.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$transaction': {
				'$account': {
					'$network': {
						'$network': {
							caip2: caip2ParamValueFromString(params.caip2),
						},
					},
					address: decodeURIComponent(params.address),
				},
				lt: decodeURIComponent(params.lt),
				hash: decodeURIComponent(params.hash),
			},
			phaseKind: decodeURIComponent(params.phaseKind),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid TonTransactionPhase selector')

	return { selector }
}
