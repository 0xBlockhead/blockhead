// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MevBuilder_TimestampSchema from '$/schema/MevBuilder_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const mevBuilderTimestampSelector = parseEntitySelector(
		schema,
		MevBuilder_TimestampSchema,
		{
			$builder: {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				builderPubkey: decodeURIComponent(params.builderPubkey),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (mevBuilderTimestampSelector instanceof arktype.errors) error(404, 'Invalid MevBuilder_Timestamp selector')

	return {
		selector: mevBuilderTimestampSelector,
	}
}
