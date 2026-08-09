// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import ActivityPubInstance_TimestampSchema from '$/schema/ActivityPubInstance_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(
		matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
		&& matchAbsoluteUrl(params.instanceOrigin)
	))
		error(404, 'Route mapping not applicable')

	const activityPubInstanceTimestampInstanceTimestampMsSourceSelector = parseEntitySelector(
		schema,
		ActivityPubInstance_TimestampSchema,
		{
			$instance: {
				instanceOrigin: decodeURIComponent(params.instanceOrigin),
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		},
		'InstanceTimestampMsSource'
	)
	if (activityPubInstanceTimestampInstanceTimestampMsSourceSelector instanceof arktype.errors)
		error(404, 'Invalid ActivityPubInstance_Timestamp selector')

	return {
		selector: activityPubInstanceTimestampInstanceTimestampMsSourceSelector,
	}
}
