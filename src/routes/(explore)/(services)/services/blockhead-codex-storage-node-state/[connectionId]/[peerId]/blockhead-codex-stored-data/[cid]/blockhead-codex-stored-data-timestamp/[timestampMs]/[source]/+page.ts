import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadCodexStoredData_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$storedData': {
				'$nodeState': {
					connectionId: decodeURIComponent(params.connectionId),
					peerId: decodeURIComponent(params.peerId),
				},
				cid: decodeURIComponent(params.cid),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadCodexStoredData_Timestamp selector')

	return { selector }
}
