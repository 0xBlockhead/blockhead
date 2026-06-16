import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'
import { parse } from 'devalue'

import { parseEntitySelector } from '$/schema/$schema.ts'
import BridgeRouteSchema from '$/schema/BridgeRoute.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	let selector
	try {
		selector = parseEntitySelector(
			schema,
			BridgeRouteSchema,
			parse(decodeURIComponent(params.routeId))
		)
	} catch {
		error(404, 'Invalid bridge route')
	}
	if (selector instanceof arktype.errors) error(404, 'Invalid bridge route')

	return { selector }
}
