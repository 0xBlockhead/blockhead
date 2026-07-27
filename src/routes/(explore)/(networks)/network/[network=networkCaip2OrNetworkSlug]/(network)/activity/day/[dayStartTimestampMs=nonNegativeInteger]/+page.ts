// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import Network_Activity_DaySchema from '$/schema/Network_Activity_Day.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')) && matchNonNegativeInteger(params.dayStartTimestampMs))) error(404, 'Route mapping not applicable')

	const networkActivityDayNetworkDayStartTimestampMsSourceSelector = parseEntitySelector(
		schema,
		Network_Activity_DaySchema,
		{
			$network: parentData.selector,
			dayStartTimestampMs: Number(params.dayStartTimestampMs),
			source: 'SpaceAndTime_MakeInfinite',
		}
	)
	if (networkActivityDayNetworkDayStartTimestampMsSourceSelector instanceof arktype.errors) error(404, 'Invalid Network_Activity_Day selector')

	return {
		selector: networkActivityDayNetworkDayStartTimestampMsSourceSelector,
	}
}
