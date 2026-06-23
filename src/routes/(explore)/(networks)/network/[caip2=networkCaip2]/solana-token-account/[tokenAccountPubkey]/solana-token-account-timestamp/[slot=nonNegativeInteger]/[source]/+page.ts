import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/SolanaTokenAccount_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$tokenAccount': {
				'$network': {
					caip2: caip2ParamValueFromString(params.caip2),
				},
				tokenAccountPubkey: decodeURIComponent(params.tokenAccountPubkey),
			},
			slot: Number(params.slot),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid SolanaTokenAccount_Timestamp selector')

	return { selector }
}
