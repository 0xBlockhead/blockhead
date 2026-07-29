// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AtprotoActorSchema from '$/schema/AtprotoActor.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.did)))
		error(404, 'Route mapping not applicable')

	const atprotoActorDidSelector = parseEntitySelector(
		schema,
		AtprotoActorSchema,
		{
			did: decodeURIComponent(params.did),
		}
	)
	if (atprotoActorDidSelector instanceof arktype.errors)
		error(404, 'Invalid AtprotoActor selector')

	return {
		selector: atprotoActorDidSelector,
	}
}
