// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import PolkadotAccount_TimestampSchema from '$/schema/PolkadotAccount_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const polkadotAccountTimestampSelector = parseEntitySelector(
		schema,
		PolkadotAccount_TimestampSchema,
		{
			$account: {
				$network: {
					slug: params.networkSlug,
				},
				accountId: decodeURIComponent(params.accountId),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (polkadotAccountTimestampSelector instanceof arktype.errors) error(404, 'Invalid PolkadotAccount_Timestamp selector')

	return {
		selector: polkadotAccountTimestampSelector,
	}
}
