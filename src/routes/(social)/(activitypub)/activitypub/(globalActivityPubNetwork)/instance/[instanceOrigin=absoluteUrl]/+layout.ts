// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import ActivityPubInstanceSchema from '$/schema/ActivityPubInstance.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchAbsoluteUrl(params.instanceOrigin)))
		error(404, 'Route mapping not applicable')

	const activityPubInstanceInstanceOriginSelector = parseEntitySelector(
		schema,
		ActivityPubInstanceSchema,
		{
			instanceOrigin: decodeURIComponent(params.instanceOrigin),
		}
	)
	if (activityPubInstanceInstanceOriginSelector instanceof arktype.errors)
		error(404, 'Invalid ActivityPubInstance selector')

	return {
		selector: activityPubInstanceInstanceOriginSelector,
	}
}
