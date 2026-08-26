// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import IbcClientSchema from '$/schema/IbcClient.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Cosmos']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'CosmosSdk')
			)
			&& parentData.projectionNetwork.namespace === 'Cosmos'
		)
		&& matchStringSegment(params.clientId)
	))
		error(404, 'Route mapping not applicable')

	const ibcClientNetworkClientIdSelector = parseRouteEntitySelector(
		schema,
		IbcClientSchema,
		{
			$network: parentData.selector,
			clientId: params.clientId,
		},
		'NetworkClientId'
	)
	if (ibcClientNetworkClientIdSelector instanceof arktype.errors)
		error(404, 'Invalid IbcClient selector')

	return {
		selector: ibcClientNetworkClientIdSelector,
	}
}
