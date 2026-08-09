// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AvalancheSubnetSchema from '$/schema/AvalancheSubnet.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.subnetId)))
		error(404, 'Route mapping not applicable')

	const avalancheSubnetSubnetIdSelector = parseEntitySelector(
		schema,
		AvalancheSubnetSchema,
		{
			subnetId: params.subnetId,
		},
		'SubnetId'
	)
	if (avalancheSubnetSubnetIdSelector instanceof arktype.errors)
		error(404, 'Invalid AvalancheSubnet selector')

	return {
		selector: avalancheSubnetSubnetIdSelector,
	}
}
