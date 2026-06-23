import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/BnbBeaconTokenMigration_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$migration': {
				'$token': {
					'$network': {
						'$network': {
							caip2: caip2ParamValueFromString(params.caip2),
						},
					},
					symbol: decodeURIComponent(params.symbol),
				},
				targetNetwork: decodeURIComponent(params.targetNetwork),
				targetAddress: decodeURIComponent(params.targetAddress),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BnbBeaconTokenMigration_Timestamp selector')

	return { selector }
}
