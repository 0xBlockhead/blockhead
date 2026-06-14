import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'
import { parse } from 'devalue'

import { parseEntitySelector } from '$/schema/$schema.ts'
import BridgeRouteSchema from '$/schema/BridgeRoute.ts'
import BridgeRouteStepSchema from '$/schema/BridgeRouteStep.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	let routeEntitySelector
	try {
		routeEntitySelector = parseEntitySelector(
			schema,
			BridgeRouteSchema,
			parse(decodeURIComponent(params.routeId)),
		)
	} catch {
		error(404, 'Invalid bridge route')
	}
	if (routeEntitySelector instanceof arktype.errors) error(404, 'Invalid bridge route')

	const index = Number(params.stepIndex)
	if (!Number.isInteger(index) || index < 0) error(404, 'Invalid bridge step')

	const entitySelector = parseEntitySelector(schema, BridgeRouteStepSchema, {
		$route: routeEntitySelector,
		index,
	})
	if (entitySelector instanceof arktype.errors) error(404, 'Invalid bridge step')

	return { entitySelector }
}
