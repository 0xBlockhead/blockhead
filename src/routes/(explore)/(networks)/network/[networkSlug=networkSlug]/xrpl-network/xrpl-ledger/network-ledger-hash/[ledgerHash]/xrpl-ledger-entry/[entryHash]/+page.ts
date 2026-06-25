import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/XrplLedgerEntry.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$ledger': {
				'$network': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
				},
				ledgerHash: decodeURIComponent(params.ledgerHash),
			},
			entryHash: decodeURIComponent(params.entryHash),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid XrplLedgerEntry selector')

	return { selector }
}
