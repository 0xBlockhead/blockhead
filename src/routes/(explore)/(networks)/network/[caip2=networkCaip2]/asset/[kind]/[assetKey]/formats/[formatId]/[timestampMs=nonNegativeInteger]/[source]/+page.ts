// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AssetFormatSupport_TimestampSchema from '$/schema/AssetFormatSupport_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const assetFormatSupportTimestampSelector = parseEntitySelector(
		schema,
		AssetFormatSupport_TimestampSchema,
		{
			$assetInstance: {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				kind: decodeURIComponent(params.kind),
				assetKey: decodeURIComponent(params.assetKey),
			},
			formatId: decodeURIComponent(params.formatId),
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (assetFormatSupportTimestampSelector instanceof arktype.errors) error(404, 'Invalid AssetFormatSupport_Timestamp selector')

	return {
		selector: assetFormatSupportTimestampSelector,
	}
}
