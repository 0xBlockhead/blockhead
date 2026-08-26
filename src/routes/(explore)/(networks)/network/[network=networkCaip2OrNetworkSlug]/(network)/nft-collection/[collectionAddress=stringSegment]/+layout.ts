// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TonNftCollectionSchema from '$/schema/TonNftCollection.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.collectionAddress)))
		error(404, 'Route mapping not applicable')

	const tonNftCollectionNetworkCollectionAddressSelector = parseRouteEntitySelector(
		schema,
		TonNftCollectionSchema,
		{
			$network: parentData.selector,
			collectionAddress: params.collectionAddress,
		},
		'NetworkCollectionAddress'
	)
	if (tonNftCollectionNetworkCollectionAddressSelector instanceof arktype.errors)
		error(404, 'Invalid TonNftCollection selector')

	return {
		selector: tonNftCollectionNetworkCollectionAddressSelector,
	}
}
