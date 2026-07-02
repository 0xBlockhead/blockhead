// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MevRelay_TimestampSchema from '$/schema/MevRelay_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const mevRelayTimestampSelector = parseEntitySelector(
		schema,
		MevRelay_TimestampSchema,
		{
			$relay: {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				host: decodeURIComponent(params.host),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (mevRelayTimestampSelector instanceof arktype.errors) error(404, 'Invalid MevRelay_Timestamp selector')

	return {
		selector: mevRelayTimestampSelector,
	}
}
