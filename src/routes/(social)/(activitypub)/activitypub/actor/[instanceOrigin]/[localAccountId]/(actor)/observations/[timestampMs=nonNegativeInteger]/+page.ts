// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import ActivityPubActor_TimestampSchema from '$/schema/ActivityPubActor_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const activityPubActorTimestampSelector = parseEntitySelector(
		schema,
		ActivityPubActor_TimestampSchema,
		{
			$actor: {
				instanceOrigin: decodeURIComponent(params.instanceOrigin),
				localAccountId: decodeURIComponent(params.localAccountId),
			},
			timestampMs: Number(params.timestampMs),
		}
	)
	if (activityPubActorTimestampSelector instanceof arktype.errors) error(404, 'Invalid ActivityPubActor_Timestamp selector')

	return {
		selector: activityPubActorTimestampSelector,
	}
}
