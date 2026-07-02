// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadRoomPeerSchema from '$/schema/BlockheadRoomPeer.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const blockheadRoomPeerSelector = parseEntitySelector(
		schema,
		BlockheadRoomPeerSchema,
		{
			id: params.contactId,
		}
	)
	if (blockheadRoomPeerSelector instanceof arktype.errors) error(404, 'Invalid BlockheadRoomPeer selector')

	return {
		selector: blockheadRoomPeerSelector,
	}
}
