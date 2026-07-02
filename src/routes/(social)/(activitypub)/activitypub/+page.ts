// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import ActivityPubNetworkSchema from '$/schema/ActivityPubNetwork.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const activityPubNetworkSelector = parseEntitySelector(
		schema,
		ActivityPubNetworkSchema,
		{
			scope: 'ActivityPubNetwork',
		}
	)
	if (activityPubNetworkSelector instanceof arktype.errors) error(404, 'Invalid ActivityPubNetwork selector')

	return {
		selector: activityPubNetworkSelector,
	}
}
