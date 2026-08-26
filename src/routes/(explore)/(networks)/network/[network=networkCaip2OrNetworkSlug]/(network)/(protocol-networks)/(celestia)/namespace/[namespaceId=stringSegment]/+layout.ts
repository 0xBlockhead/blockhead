// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import CelestiaNamespaceSchema from '$/schema/CelestiaNamespace.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Celestia']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Celestia' && matchStringSegment(params.namespaceId)))
		error(404, 'Route mapping not applicable')

	const celestiaNamespaceNetworkNamespaceIdSelector = parseRouteEntitySelector(
		schema,
		CelestiaNamespaceSchema,
		{
			$network: parentData.selector,
			namespaceId: params.namespaceId,
		},
		'NetworkNamespaceId'
	)
	if (celestiaNamespaceNetworkNamespaceIdSelector instanceof arktype.errors)
		error(404, 'Invalid CelestiaNamespace selector')

	return {
		selector: celestiaNamespaceNetworkNamespaceIdSelector,
	}
}
