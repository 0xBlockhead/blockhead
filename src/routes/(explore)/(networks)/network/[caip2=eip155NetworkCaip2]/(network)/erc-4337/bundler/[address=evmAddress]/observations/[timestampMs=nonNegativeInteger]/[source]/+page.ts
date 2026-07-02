// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import Erc4337Bundler_TimestampSchema from '$/schema/Erc4337Bundler_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const erc4337BundlerTimestampSelector = parseEntitySelector(
		schema,
		Erc4337Bundler_TimestampSchema,
		{
			$bundler: {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				address: decodeURIComponent(params.address),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (erc4337BundlerTimestampSelector instanceof arktype.errors) error(404, 'Invalid Erc4337Bundler_Timestamp selector')

	return {
		selector: erc4337BundlerTimestampSelector,
	}
}
