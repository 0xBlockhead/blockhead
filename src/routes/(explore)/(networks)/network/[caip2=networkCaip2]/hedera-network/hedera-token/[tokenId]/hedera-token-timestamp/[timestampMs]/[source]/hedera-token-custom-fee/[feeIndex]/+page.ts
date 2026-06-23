import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/HederaTokenCustomFee.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$tokenTimestamp': {
				'$token': {
					'$network': {
						'$network': {
							caip2: caip2ParamValueFromString(params.caip2),
						},
					},
					tokenId: decodeURIComponent(params.tokenId),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			},
			feeIndex: decodeURIComponent(params.feeIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid HederaTokenCustomFee selector')

	return { selector }
}
