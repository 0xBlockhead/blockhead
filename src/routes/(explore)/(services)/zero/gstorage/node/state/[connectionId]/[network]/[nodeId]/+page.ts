import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadZeroGStorageNodeState.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			connectionId: decodeURIComponent(params.connectionId),
			network: decodeURIComponent(params.network),
			nodeId: decodeURIComponent(params.nodeId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadZeroGStorageNodeState selector')

	return { selector }
}
