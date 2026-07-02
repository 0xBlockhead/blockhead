// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AssetSupply_TimestampSchema from '$/schema/AssetSupply_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const assetSupplyTimestampSelector = parseEntitySelector(
		schema,
		AssetSupply_TimestampSchema,
		{
			$assetInstance: {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				kind: decodeURIComponent(params.kind),
				assetKey: decodeURIComponent(params.assetKey),
			},
			supplyScopeKey: decodeURIComponent(params.supplyScopeKey),
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (assetSupplyTimestampSelector instanceof arktype.errors) error(404, 'Invalid AssetSupply_Timestamp selector')

	return {
		selector: assetSupplyTimestampSelector,
	}
}
