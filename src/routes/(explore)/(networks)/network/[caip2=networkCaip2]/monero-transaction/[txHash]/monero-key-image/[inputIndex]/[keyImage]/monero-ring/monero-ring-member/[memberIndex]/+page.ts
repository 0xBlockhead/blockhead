import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/MoneroRingMember.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$ring': {
				'$keyImage': {
					'$transaction': {
						'$network': {
							caip2: caip2ParamValueFromString(params.caip2),
						},
						txHash: decodeURIComponent(params.txHash),
					},
					inputIndex: decodeURIComponent(params.inputIndex),
					keyImage: decodeURIComponent(params.keyImage),
				},
			},
			memberIndex: decodeURIComponent(params.memberIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid MoneroRingMember selector')

	return { selector }
}
