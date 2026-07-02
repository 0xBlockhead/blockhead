// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadRoomSchema from '$/schema/BlockheadRoom.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const blockheadRoomSelector = parseEntitySelector(
		schema,
		BlockheadRoomSchema,
		{
			id: params.roomId,
		}
	)
	if (blockheadRoomSelector instanceof arktype.errors) error(404, 'Invalid BlockheadRoom selector')

	return {
		selector: blockheadRoomSelector,
	}
}
