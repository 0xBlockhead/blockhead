import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
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
					'$sourceTransaction': {
						'$account': {
							'$network': {
								'$network': {
									slug: decodeURIComponent(params.networkSlug),
								},
							},
							address: decodeURIComponent(params.address),
						},
						lt: decodeURIComponent(params.lt),
					},
					outIndex: decodeURIComponent(params.outIndex),
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
