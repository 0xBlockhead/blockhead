import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadCashuWalletState_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$walletState': {
				walletId: decodeURIComponent(params.walletId),
				mintUrl: decodeURIComponent(params.mintUrl),
				unit: decodeURIComponent(params.unit),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadCashuWalletState_Timestamp selector')

	return { selector }
}
