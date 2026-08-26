// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import FedimintGatewaySchema from '$/schema/FedimintGateway.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.gatewayId)))
		error(404, 'Route mapping not applicable')

	const fedimintGatewayGatewayIdSelector = parseRouteEntitySelector(
		schema,
		FedimintGatewaySchema,
		{
			gatewayId: params.gatewayId,
		},
		'GatewayId'
	)
	if (fedimintGatewayGatewayIdSelector instanceof arktype.errors)
		error(404, 'Invalid FedimintGateway selector')

	return {
		selector: fedimintGatewayGatewayIdSelector,
	}
}
