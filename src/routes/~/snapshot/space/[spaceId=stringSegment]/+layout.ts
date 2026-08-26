// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SnapshotSpaceSchema from '$/schema/SnapshotSpace.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.spaceId)))
		error(404, 'Route mapping not applicable')

	const snapshotSpaceSpaceIdSelector = parseRouteEntitySelector(
		schema,
		SnapshotSpaceSchema,
		{
			spaceId: decodeURIComponent(params.spaceId),
		},
		'SpaceId'
	)
	if (snapshotSpaceSpaceIdSelector instanceof arktype.errors)
		error(404, 'Invalid SnapshotSpace selector')

	return {
		selector: snapshotSpaceSpaceIdSelector,
	}
}
