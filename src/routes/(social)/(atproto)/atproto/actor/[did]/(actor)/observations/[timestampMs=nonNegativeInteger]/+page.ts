// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AtprotoActor_TimestampSchema from '$/schema/AtprotoActor_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const atprotoActorTimestampSelector = parseEntitySelector(
		schema,
		AtprotoActor_TimestampSchema,
		{
			$actor: {
				did: decodeURIComponent(params.did),
			},
			timestampMs: Number(params.timestampMs),
		}
	)
	if (atprotoActorTimestampSelector instanceof arktype.errors) error(404, 'Invalid AtprotoActor_Timestamp selector')

	return {
		selector: atprotoActorTimestampSelector,
	}
}
