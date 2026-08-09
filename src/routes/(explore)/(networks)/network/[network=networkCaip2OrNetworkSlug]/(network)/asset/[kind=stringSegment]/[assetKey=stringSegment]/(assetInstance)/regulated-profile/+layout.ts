// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RegulatedAssetProfileSchema from '$/schema/RegulatedAssetProfile.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const regulatedAssetProfileAssetInstanceSelector = parseEntitySelector(
		schema,
		RegulatedAssetProfileSchema,
		{
			$assetInstance: parentData.selector,
		},
		'AssetInstance'
	)
	if (regulatedAssetProfileAssetInstanceSelector instanceof arktype.errors)
		error(404, 'Invalid RegulatedAssetProfile selector')

	return {
		selector: regulatedAssetProfileAssetInstanceSelector,
	}
}
