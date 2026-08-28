// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AssetInstanceSchema from '$/schema/AssetInstance.ts'
import { schema } from '$/schema/index.ts'
import RegulatedAssetProfileSchema from '$/schema/RegulatedAssetProfile.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const assetInstanceNetworkKindAssetKeyParentSelector = parseRouteEntitySelector(
		schema,
		AssetInstanceSchema,
		parentData.selector,
		'NetworkKindAssetKey'
	)
	if (assetInstanceNetworkKindAssetKeyParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const regulatedAssetProfileAssetInstanceSelector = parseRouteEntitySelector(
		schema,
		RegulatedAssetProfileSchema,
		{
			$assetInstance: assetInstanceNetworkKindAssetKeyParentSelector,
		},
		'AssetInstance'
	)
	if (regulatedAssetProfileAssetInstanceSelector instanceof arktype.errors)
		error(404, 'Invalid RegulatedAssetProfile selector')

	return {
		selector: regulatedAssetProfileAssetInstanceSelector,
	}
}
