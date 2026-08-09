// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import PolkadotAssetSchema from '$/schema/PolkadotAsset.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Polkadot']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')
			)
			&& parentData.projectionNetwork.namespace === 'Polkadot'
		)
		&& matchStringSegment(params.assetKind)
		&& matchStringSegment(params.assetId)
	))
		error(404, 'Route mapping not applicable')

	const polkadotAssetNetworkAssetKindAssetIdSelector = parseEntitySelector(
		schema,
		PolkadotAssetSchema,
		{
			$network: parentData.selector,
			assetKind: params.assetKind,
			assetId: params.assetId,
		},
		'NetworkAssetKindAssetId'
	)
	if (polkadotAssetNetworkAssetKindAssetIdSelector instanceof arktype.errors)
		error(404, 'Invalid PolkadotAsset selector')

	return {
		selector: polkadotAssetNetworkAssetKindAssetIdSelector,
	}
}
