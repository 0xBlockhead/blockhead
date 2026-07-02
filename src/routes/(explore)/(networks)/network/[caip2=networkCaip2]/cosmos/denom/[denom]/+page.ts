// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CosmosDenomSchema from '$/schema/CosmosDenom.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const cosmosDenomSelector = parseEntitySelector(
		schema,
		CosmosDenomSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			denom: decodeURIComponent(params.denom),
		}
	)
	if (cosmosDenomSelector instanceof arktype.errors) error(404, 'Invalid CosmosDenom selector')

	return {
		selector: cosmosDenomSelector,
	}
}
