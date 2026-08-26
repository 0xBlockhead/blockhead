// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import CardanoNativeAssetSchema from '$/schema/CardanoNativeAsset.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Cardano']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Cardano'
		&& matchStringSegment(params.policyId)
		&& matchStringSegment(params.assetName)
	))
		error(404, 'Route mapping not applicable')

	const cardanoNativeAssetNetworkPolicyIdAssetNameSelector = parseRouteEntitySelector(
		schema,
		CardanoNativeAssetSchema,
		{
			$network: parentData.selector,
			policyId: params.policyId,
			assetName: params.assetName,
		},
		'NetworkPolicyIdAssetName'
	)
	if (cardanoNativeAssetNetworkPolicyIdAssetNameSelector instanceof arktype.errors)
		error(404, 'Invalid CardanoNativeAsset selector')

	return {
		selector: cardanoNativeAssetNetworkPolicyIdAssetNameSelector,
	}
}
