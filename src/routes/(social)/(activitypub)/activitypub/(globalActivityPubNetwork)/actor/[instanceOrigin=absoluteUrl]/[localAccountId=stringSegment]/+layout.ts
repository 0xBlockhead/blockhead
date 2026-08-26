// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import ActivityPubActorSchema from '$/schema/ActivityPubActor.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchAbsoluteUrl(params.instanceOrigin) && matchStringSegment(params.localAccountId)))
		error(404, 'Route mapping not applicable')

	const activityPubActorLocalAccountIdSelector = parseRouteEntitySelector(
		schema,
		ActivityPubActorSchema,
		{
			instanceOrigin: decodeURIComponent(params.instanceOrigin),
			localAccountId: params.localAccountId,
		},
		'LocalAccountId'
	)
	if (activityPubActorLocalAccountIdSelector instanceof arktype.errors)
		error(404, 'Invalid ActivityPubActor selector')

	return {
		selector: activityPubActorLocalAccountIdSelector,
	}
}
