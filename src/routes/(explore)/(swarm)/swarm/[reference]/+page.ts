// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { swarmResourceReferenceFromRouteParam } from '$/lib/swarm.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SwarmResourceSchema from '$/schema/SwarmResource.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const swarmResourceSelector = parseEntitySelector(
		schema,
		SwarmResourceSchema,
		{
			reference: swarmResourceReferenceFromRouteParam(decodeURIComponent(params.reference)),
			contentPath: '',
		}
	)
	if (swarmResourceSelector instanceof arktype.errors) error(404, 'Invalid SwarmResource selector')

	return {
		selector: swarmResourceSelector,
	}
}
