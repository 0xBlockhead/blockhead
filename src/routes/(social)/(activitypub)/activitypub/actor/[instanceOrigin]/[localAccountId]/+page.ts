// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import ActivityPubActorSchema from '$/schema/ActivityPubActor.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const activityPubActorSelector = parseEntitySelector(
		schema,
		ActivityPubActorSchema,
		{
			instanceOrigin: decodeURIComponent(params.instanceOrigin),
			localAccountId: decodeURIComponent(params.localAccountId),
		}
	)
	if (activityPubActorSelector instanceof arktype.errors) error(404, 'Invalid ActivityPubActor selector')

	return {
		selector: activityPubActorSelector,
	}
}
