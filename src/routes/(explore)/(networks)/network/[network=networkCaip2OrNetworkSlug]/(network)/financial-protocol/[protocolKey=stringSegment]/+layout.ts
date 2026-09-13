// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import FinancialProtocolSchema from '$/schema/FinancialProtocol.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.protocolKey)))
		error(404, 'Route mapping not applicable')

	const financialProtocolNetworkProtocolKeySelector = parseRouteEntitySelector(
		schema,
		FinancialProtocolSchema,
		{
			$network: parentData.selector,
			protocolKey: params.protocolKey,
		},
		'NetworkProtocolKey'
	)
	if (financialProtocolNetworkProtocolKeySelector instanceof arktype.errors)
		error(404, 'Invalid FinancialProtocol selector')

	return {
		selector: financialProtocolNetworkProtocolKeySelector,
	}
}
