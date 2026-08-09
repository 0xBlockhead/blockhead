// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AvalancheValidatorSchema from '$/schema/AvalancheValidator.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.nodeId) && matchStringSegment(params.subnetId) && matchNonNegativeInteger(params.startTimeMs)))
		error(404, 'Route mapping not applicable')

	const avalancheValidatorNodeIdSubnetIdStartTimeMsSelector = parseEntitySelector(
		schema,
		AvalancheValidatorSchema,
		{
			nodeId: params.nodeId,
			subnetId: params.subnetId,
			startTimeMs: Number(params.startTimeMs),
		},
		'NodeIdSubnetIdStartTimeMs'
	)
	if (avalancheValidatorNodeIdSubnetIdStartTimeMsSelector instanceof arktype.errors)
		error(404, 'Invalid AvalancheValidator selector')

	return {
		selector: avalancheValidatorNodeIdSubnetIdStartTimeMsSelector,
	}
}
