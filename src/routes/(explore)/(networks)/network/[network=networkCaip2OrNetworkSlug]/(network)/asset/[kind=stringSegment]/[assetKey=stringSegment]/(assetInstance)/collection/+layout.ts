// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NftCollectionSchema from '$/schema/NftCollection.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const nftCollectionAssetInstanceSelector = parseEntitySelector(
		schema,
		NftCollectionSchema,
		{
			$assetInstance: parentData.selector,
		},
		'AssetInstance'
	)
	if (nftCollectionAssetInstanceSelector instanceof arktype.errors)
		error(404, 'Invalid NftCollection selector')

	return {
		selector: nftCollectionAssetInstanceSelector,
	}
}
