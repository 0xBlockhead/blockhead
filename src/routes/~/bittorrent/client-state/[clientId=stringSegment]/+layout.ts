// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadBitTorrentClientStateSchema from '$/schema/BlockheadBitTorrentClientState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.clientId)))
		error(404, 'Route mapping not applicable')

	const blockheadBitTorrentClientStateClientIdSelector = parseRouteEntitySelector(
		schema,
		BlockheadBitTorrentClientStateSchema,
		{
			clientId: params.clientId,
		},
		'ClientId'
	)
	if (blockheadBitTorrentClientStateClientIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadBitTorrentClientState selector')

	return {
		selector: blockheadBitTorrentClientStateClientIdSelector,
	}
}
