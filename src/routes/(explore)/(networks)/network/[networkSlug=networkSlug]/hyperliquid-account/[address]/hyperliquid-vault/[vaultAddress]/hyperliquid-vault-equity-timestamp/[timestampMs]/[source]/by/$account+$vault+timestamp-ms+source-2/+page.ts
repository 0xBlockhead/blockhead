import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/HyperliquidVaultEquity_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$account': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
				address: decodeURIComponent(params.address),
			},
			'$vault': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
				vaultAddress: decodeURIComponent(params.vaultAddress),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid HyperliquidVaultEquity_Timestamp selector')

	return { selector }
}
