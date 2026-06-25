import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/BridgeTransfer_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$transfer': {
				'$sourceTx': {
					'$network': {
						caip2: caip2ParamValueFromString(params.caip2),
					},
					txHash: decodeURIComponent(params.txHash),
				},
				source: decodeURIComponent(params.source),
				logIndex: Number(params.logIndex),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.bridgeTransferTimestampSource),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BridgeTransfer_Timestamp selector')

	return { selector }
}
