// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import ActivityPubInstanceSchema from '$/schema/ActivityPubInstance.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchAbsoluteUrl(params.instanceOrigin)))
		error(404, 'Route mapping not applicable')

	const activityPubInstanceInstanceOriginSelector = parseRouteEntitySelector(
		schema,
		ActivityPubInstanceSchema,
		{
			instanceOrigin: decodeURIComponent(params.instanceOrigin),
		},
		'InstanceOrigin'
	)
	if (activityPubInstanceInstanceOriginSelector instanceof arktype.errors)
		error(404, 'Invalid ActivityPubInstance selector')

	return {
		selector: activityPubInstanceInstanceOriginSelector,
	}
}
