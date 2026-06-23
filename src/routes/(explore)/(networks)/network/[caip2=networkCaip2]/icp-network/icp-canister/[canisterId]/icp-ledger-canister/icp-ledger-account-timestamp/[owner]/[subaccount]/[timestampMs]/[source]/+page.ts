import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/IcpLedgerAccount_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$ledger': {
				'$canister': {
					'$network': {
						'$network': {
							caip2: caip2ParamValueFromString(params.caip2),
						},
					},
					canisterId: decodeURIComponent(params.canisterId),
				},
			},
			owner: decodeURIComponent(params.owner),
			subaccount: decodeURIComponent(params.subaccount),
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid IcpLedgerAccount_Timestamp selector')

	return { selector }
}
