// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadFedimintClientStateSchema from '$/schema/BlockheadFedimintClientState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.clientId) && matchStringSegment(params.federationId)))
		error(404, 'Route mapping not applicable')

	const blockheadFedimintClientStateClientIdFederationIdSelector = parseRouteEntitySelector(
		schema,
		BlockheadFedimintClientStateSchema,
		{
			clientId: params.clientId,
			federationId: params.federationId,
		},
		'ClientIdFederationId'
	)
	if (blockheadFedimintClientStateClientIdFederationIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadFedimintClientState selector')

	return {
		selector: blockheadFedimintClientStateClientIdFederationIdSelector,
	}
}
