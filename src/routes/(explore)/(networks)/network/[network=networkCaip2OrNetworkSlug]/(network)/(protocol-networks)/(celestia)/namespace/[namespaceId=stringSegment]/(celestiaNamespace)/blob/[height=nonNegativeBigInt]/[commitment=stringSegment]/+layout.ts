// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import CelestiaBlobSchema from '$/schema/CelestiaBlob.ts'
import CelestiaNamespaceSchema from '$/schema/CelestiaNamespace.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Celestia']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Celestia'
		&& matchNonNegativeBigInt(params.height)
		&& matchStringSegment(params.commitment)
	))
		error(404, 'Route mapping not applicable')

	const celestiaNamespaceNetworkNamespaceIdParentSelector = parseRouteEntitySelector(
		schema,
		CelestiaNamespaceSchema,
		parentData.selector,
		'NetworkNamespaceId'
	)
	if (celestiaNamespaceNetworkNamespaceIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const celestiaBlobNamespaceHeightCommitmentSelector = parseRouteEntitySelector(
		schema,
		CelestiaBlobSchema,
		{
			$namespace: celestiaNamespaceNetworkNamespaceIdParentSelector,
			height: BigInt(params.height),
			commitment: params.commitment,
		},
		'NamespaceHeightCommitment'
	)
	if (celestiaBlobNamespaceHeightCommitmentSelector instanceof arktype.errors)
		error(404, 'Invalid CelestiaBlob selector')

	return {
		selector: celestiaBlobNamespaceHeightCommitmentSelector,
	}
}
