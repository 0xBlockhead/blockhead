// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TransferRestrictionSchema from '$/schema/TransferRestriction.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.restrictionKey) && matchStringSegment(params.restrictionSource)))
		error(404, 'Route mapping not applicable')

	const transferRestrictionAssetInstanceRestrictionKeySourceSelector = parseRouteEntitySelector(
		schema,
		TransferRestrictionSchema,
		{
			$assetInstance: parentData.selector,
			restrictionKey: params.restrictionKey,
			source: params.restrictionSource,
		},
		'AssetInstanceRestrictionKeySource'
	)
	if (transferRestrictionAssetInstanceRestrictionKeySourceSelector instanceof arktype.errors)
		error(404, 'Invalid TransferRestriction selector')

	return {
		selector: transferRestrictionAssetInstanceRestrictionKeySourceSelector,
	}
}
