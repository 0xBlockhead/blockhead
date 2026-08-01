// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AssetInstanceSchema from '$/schema/AssetInstance.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
		)
		&& matchStringSegment(params.kind)
		&& matchStringSegment(params.assetKey)
	))
		error(404, 'Route mapping not applicable')

	const assetInstanceNetworkKindAssetKeySelector = parseEntitySelector(
		schema,
		AssetInstanceSchema,
		{
			$network: parentData.selector,
			kind: params.kind,
			assetKey: params.assetKey,
		},
		'NetworkKindAssetKey'
	)
	if (assetInstanceNetworkKindAssetKeySelector instanceof arktype.errors)
		error(404, 'Invalid AssetInstance selector')

	return {
		selector: assetInstanceNetworkKindAssetKeySelector,
	}
}
