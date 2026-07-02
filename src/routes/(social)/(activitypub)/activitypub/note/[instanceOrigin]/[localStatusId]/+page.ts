// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import ActivityPubNoteSchema from '$/schema/ActivityPubNote.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const activityPubNoteSelector = parseEntitySelector(
		schema,
		ActivityPubNoteSchema,
		{
			instanceOrigin: decodeURIComponent(params.instanceOrigin),
			localStatusId: decodeURIComponent(params.localStatusId),
		}
	)
	if (activityPubNoteSelector instanceof arktype.errors) error(404, 'Invalid ActivityPubNote selector')

	return {
		selector: activityPubNoteSelector,
	}
}
