// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { swarmResourceReferenceFromRouteParam } from '$/lib/swarm.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SwarmResourceSchema from '$/schema/SwarmResource.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.reference)))
		error(404, 'Route mapping not applicable')

	const swarmResourceResourceAddressSelector = parseEntitySelector(
		schema,
		SwarmResourceSchema,
		{
			reference: swarmResourceReferenceFromRouteParam(params.reference),
			contentPath: '',
		}
	)
	if (swarmResourceResourceAddressSelector instanceof arktype.errors)
		error(404, 'Invalid SwarmResource selector')

	return {
		selector: swarmResourceResourceAddressSelector,
	}
}
