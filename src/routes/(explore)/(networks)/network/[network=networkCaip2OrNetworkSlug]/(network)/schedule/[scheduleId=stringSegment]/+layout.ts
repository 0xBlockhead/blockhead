// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import HederaScheduleSchema from '$/schema/HederaSchedule.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Hedera']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Hedera' && matchStringSegment(params.scheduleId)))
		error(404, 'Route mapping not applicable')

	const hederaScheduleNetworkScheduleIdSelector = parseRouteEntitySelector(
		schema,
		HederaScheduleSchema,
		{
			$network: parentData.selector,
			scheduleId: params.scheduleId,
		},
		'NetworkScheduleId'
	)
	if (hederaScheduleNetworkScheduleIdSelector instanceof arktype.errors)
		error(404, 'Invalid HederaSchedule selector')

	return {
		selector: hederaScheduleNetworkScheduleIdSelector,
	}
}
