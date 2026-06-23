import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/AssetSupply_LedgerCoordinate.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$assetInstance': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
				kind: decodeURIComponent(params.kind),
				assetKey: decodeURIComponent(params.assetKey),
			},
			supplyScopeKey: decodeURIComponent(params.supplyScopeKey),
			ledgerCoordinateKind: decodeURIComponent(params.ledgerCoordinateKind),
			ledgerCoordinateValue: decodeURIComponent(params.ledgerCoordinateValue),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid AssetSupply_LedgerCoordinate selector')

	return { selector }
}
