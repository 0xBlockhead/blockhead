// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BitTorrentMetainfoSchema from '$/schema/BitTorrentMetainfo.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.infoHash) && matchStringSegment(params.hashVersion)))
		error(404, 'Route mapping not applicable')

	const bitTorrentMetainfoInfoHashHashVersionSelector = parseRouteEntitySelector(
		schema,
		BitTorrentMetainfoSchema,
		{
			infoHash: params.infoHash,
			hashVersion: params.hashVersion,
		},
		'InfoHashHashVersion'
	)
	if (bitTorrentMetainfoInfoHashHashVersionSelector instanceof arktype.errors)
		error(404, 'Invalid BitTorrentMetainfo selector')

	return {
		selector: bitTorrentMetainfoInfoHashHashVersionSelector,
	}
}
