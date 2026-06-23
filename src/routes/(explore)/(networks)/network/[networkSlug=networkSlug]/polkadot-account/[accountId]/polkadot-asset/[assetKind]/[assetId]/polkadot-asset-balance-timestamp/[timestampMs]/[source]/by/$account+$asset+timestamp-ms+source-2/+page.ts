import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/PolkadotAssetBalance_Timestamp.ts'
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
				accountId: decodeURIComponent(params.accountId),
			},
			'$asset': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
				assetKind: decodeURIComponent(params.assetKind),
				assetId: Number(params.assetId),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid PolkadotAssetBalance_Timestamp selector')

	return { selector }
}
