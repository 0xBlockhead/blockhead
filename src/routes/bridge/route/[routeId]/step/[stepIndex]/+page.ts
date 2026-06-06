import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'
import { parse } from 'devalue'

import BridgeRouteSchema from '$/schema/BridgeRoute.ts'
import BridgeRouteStepSchema from '$/schema/BridgeRouteStep.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	let routeEntityId: ReturnType<typeof BridgeRouteSchema.id>
	try {
		routeEntityId = BridgeRouteSchema.id(
			parse(decodeURIComponent(params.routeId)),
		)
	} catch {
		error(404, 'Invalid bridge route')
	}
	if (routeEntityId instanceof arktype.errors) error(404, 'Invalid bridge route')

	const index = Number(params.stepIndex)
	if (!Number.isInteger(index) || index < 0) error(404, 'Invalid bridge step')

	const entityId = BridgeRouteStepSchema.id({
		$route: routeEntityId,
		index,
	})
	if (entityId instanceof arktype.errors) error(404, 'Invalid bridge step')

	return { entityId }
}
