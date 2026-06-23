import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadCodexStorageNodeState.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			connectionId: decodeURIComponent(params.connectionId),
			peerId: decodeURIComponent(params.peerId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadCodexStorageNodeState selector')

	return { selector }
}
