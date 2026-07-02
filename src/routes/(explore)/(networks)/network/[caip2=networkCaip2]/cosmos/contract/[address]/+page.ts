// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CosmosContractSchema from '$/schema/CosmosContract.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const cosmosContractSelector = parseEntitySelector(
		schema,
		CosmosContractSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			address: decodeURIComponent(params.address),
		}
	)
	if (cosmosContractSelector instanceof arktype.errors) error(404, 'Invalid CosmosContract selector')

	return {
		selector: cosmosContractSelector,
	}
}
