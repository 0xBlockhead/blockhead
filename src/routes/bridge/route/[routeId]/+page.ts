import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'
import { parse } from 'devalue'

import BridgeRouteSchema from '$/schema/BridgeRoute.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	let entityId: ReturnType<typeof BridgeRouteSchema.id>
	try {
		entityId = BridgeRouteSchema.id(
			parse(decodeURIComponent(params.routeId)),
		)
	} catch {
		error(404, 'Invalid bridge route')
	}
	if (entityId instanceof arktype.errors) error(404, 'Invalid bridge route')

	return { entityId }
}
