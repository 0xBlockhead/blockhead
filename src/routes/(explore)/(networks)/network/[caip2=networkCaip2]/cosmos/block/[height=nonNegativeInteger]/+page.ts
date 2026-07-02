// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CosmosBlockSchema from '$/schema/CosmosBlock.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const cosmosBlockSelector = parseEntitySelector(
		schema,
		CosmosBlockSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			height: BigInt(params.height),
		}
	)
	if (cosmosBlockSelector instanceof arktype.errors) error(404, 'Invalid CosmosBlock selector')

	return {
		selector: cosmosBlockSelector,
	}
}
