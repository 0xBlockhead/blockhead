// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AtprotoActorSchema from '$/schema/AtprotoActor.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const atprotoActorSelector = parseEntitySelector(
		schema,
		AtprotoActorSchema,
		{
			handle: decodeURIComponent(params.handle),
		}
	)
	if (atprotoActorSelector instanceof arktype.errors) error(404, 'Invalid AtprotoActor selector')

	return {
		selector: atprotoActorSelector,
	}
}
