// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import ActivityPubNote_TimestampSchema from '$/schema/ActivityPubNote_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const activityPubNoteTimestampSelector = parseEntitySelector(
		schema,
		ActivityPubNote_TimestampSchema,
		{
			$note: {
				instanceOrigin: decodeURIComponent(params.instanceOrigin),
				localStatusId: decodeURIComponent(params.localStatusId),
			},
			timestampMs: Number(params.timestampMs),
		}
	)
	if (activityPubNoteTimestampSelector instanceof arktype.errors) error(404, 'Invalid ActivityPubNote_Timestamp selector')

	return {
		selector: activityPubNoteTimestampSelector,
	}
}
