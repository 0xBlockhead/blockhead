// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import ActivityPubNoteSchema from '$/schema/ActivityPubNote.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchAbsoluteUrl(params.instanceOrigin) && matchStringSegment(params.localStatusId))) error(404, 'Route mapping not applicable')

	const activityPubNoteInstanceOriginLocalStatusIdSelector = parseEntitySelector(
		schema,
		ActivityPubNoteSchema,
		{
			instanceOrigin: decodeURIComponent(params.instanceOrigin),
			localStatusId: params.localStatusId,
		}
	)
	if (activityPubNoteInstanceOriginLocalStatusIdSelector instanceof arktype.errors) error(404, 'Invalid ActivityPubNote selector')

	return {
		selector: activityPubNoteInstanceOriginLocalStatusIdSelector,
	}
}
