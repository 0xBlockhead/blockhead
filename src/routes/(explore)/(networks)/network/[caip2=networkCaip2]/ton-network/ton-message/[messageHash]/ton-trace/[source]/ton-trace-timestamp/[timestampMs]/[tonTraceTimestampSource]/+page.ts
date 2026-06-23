import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/TonTrace_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$trace': {
				'$rootMessage': {
					'$network': {
						'$network': {
							caip2: caip2ParamValueFromString(params.caip2),
						},
					},
					messageHash: decodeURIComponent(params.messageHash),
				},
				source: decodeURIComponent(params.source),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.tonTraceTimestampSource),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid TonTrace_Timestamp selector')

	return { selector }
}
