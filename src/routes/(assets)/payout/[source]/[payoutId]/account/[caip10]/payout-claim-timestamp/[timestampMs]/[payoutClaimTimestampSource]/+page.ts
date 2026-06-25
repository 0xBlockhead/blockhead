import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/PayoutClaim_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$payout': {
				source: decodeURIComponent(params.source),
				payoutId: decodeURIComponent(params.payoutId),
			},
			'$account': {
				caip10: decodeURIComponent(params.caip10),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.payoutClaimTimestampSource),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid PayoutClaim_Timestamp selector')

	return { selector }
}
