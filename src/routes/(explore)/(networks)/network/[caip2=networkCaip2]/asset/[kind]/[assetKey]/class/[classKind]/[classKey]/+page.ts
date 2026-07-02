// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AssetClassSchema from '$/schema/AssetClass.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const assetClassSelector = parseEntitySelector(
		schema,
		AssetClassSchema,
		{
			$assetInstance: {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				kind: decodeURIComponent(params.kind),
				assetKey: decodeURIComponent(params.assetKey),
			},
			classKind: decodeURIComponent(params.classKind),
			classKey: decodeURIComponent(params.classKey),
		}
	)
	if (assetClassSelector instanceof arktype.errors) error(404, 'Invalid AssetClass selector')

	return {
		selector: assetClassSelector,
	}
}
