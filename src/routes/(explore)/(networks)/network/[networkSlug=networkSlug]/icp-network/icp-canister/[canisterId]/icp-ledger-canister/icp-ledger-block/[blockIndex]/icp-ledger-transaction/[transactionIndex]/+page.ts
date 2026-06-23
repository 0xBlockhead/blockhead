import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/IcpLedgerTransaction.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$block': {
				'$ledger': {
					'$canister': {
						'$network': {
							'$network': {
								slug: decodeURIComponent(params.networkSlug),
							},
						},
						canisterId: decodeURIComponent(params.canisterId),
					},
				},
				blockIndex: decodeURIComponent(params.blockIndex),
			},
			transactionIndex: decodeURIComponent(params.transactionIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid IcpLedgerTransaction selector')

	return { selector }
}
