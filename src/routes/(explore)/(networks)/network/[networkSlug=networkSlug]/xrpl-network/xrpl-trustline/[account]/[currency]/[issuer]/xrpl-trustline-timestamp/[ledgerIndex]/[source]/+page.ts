import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/XrplTrustline_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$trustline': {
				'$network': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
				},
				account: decodeURIComponent(params.account),
				currency: decodeURIComponent(params.currency),
				issuer: decodeURIComponent(params.issuer),
			},
			ledgerIndex: decodeURIComponent(params.ledgerIndex),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid XrplTrustline_Timestamp selector')

	return { selector }
}
