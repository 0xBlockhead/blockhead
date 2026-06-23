import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadWakuMessageObservation_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$nodeState': {
				connectionId: decodeURIComponent(params.connectionId),
				nodeId: decodeURIComponent(params.nodeId),
			},
			messageHash: decodeURIComponent(params.messageHash),
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadWakuMessageObservation_Timestamp selector')

	return { selector }
}
