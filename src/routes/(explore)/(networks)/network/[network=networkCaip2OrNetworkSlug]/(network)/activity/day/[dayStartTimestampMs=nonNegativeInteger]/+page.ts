// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import Network_Activity_DaySchema from '$/schema/Network_Activity_Day.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
		)
		&& matchNonNegativeInteger(params.dayStartTimestampMs)
	))
		error(404, 'Route mapping not applicable')

	const networkActivityDayNetworkDayStartTimestampMsSourceSelector = parseRouteEntitySelector(
		schema,
		Network_Activity_DaySchema,
		{
			$network: parentData.selector,
			dayStartTimestampMs: Number(params.dayStartTimestampMs),
			source: 'SpaceAndTime_MakeInfinite',
		},
		'NetworkDayStartTimestampMsSource'
	)
	if (networkActivityDayNetworkDayStartTimestampMsSourceSelector instanceof arktype.errors)
		error(404, 'Invalid Network_Activity_Day selector')

	return {
		selector: networkActivityDayNetworkDayStartTimestampMsSourceSelector,
	}
}
