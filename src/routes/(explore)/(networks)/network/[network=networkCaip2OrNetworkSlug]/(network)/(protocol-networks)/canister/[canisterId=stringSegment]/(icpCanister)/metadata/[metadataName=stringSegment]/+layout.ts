// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import IcpCanisterMetadataSchema from '$/schema/IcpCanisterMetadata.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['InternetComputer']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'InternetComputer' && matchStringSegment(params.metadataName)))
		error(404, 'Route mapping not applicable')

	const icpCanisterMetadataCanisterMetadataNameSelector = parseRouteEntitySelector(
		schema,
		IcpCanisterMetadataSchema,
		{
			$canister: parentData.selector,
			metadataName: params.metadataName,
		},
		'CanisterMetadataName'
	)
	if (icpCanisterMetadataCanisterMetadataNameSelector instanceof arktype.errors)
		error(404, 'Invalid IcpCanisterMetadata selector')

	return {
		selector: icpCanisterMetadataCanisterMetadataNameSelector,
	}
}
