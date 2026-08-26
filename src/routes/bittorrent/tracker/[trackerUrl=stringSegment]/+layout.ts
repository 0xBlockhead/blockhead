// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BitTorrentTrackerSchema from '$/schema/BitTorrentTracker.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.trackerUrl)))
		error(404, 'Route mapping not applicable')

	const bitTorrentTrackerTrackerUrlSelector = parseRouteEntitySelector(
		schema,
		BitTorrentTrackerSchema,
		{
			trackerUrl: params.trackerUrl,
		},
		'TrackerUrl'
	)
	if (bitTorrentTrackerTrackerUrlSelector instanceof arktype.errors)
		error(404, 'Invalid BitTorrentTracker selector')

	return {
		selector: bitTorrentTrackerTrackerUrlSelector,
	}
}
