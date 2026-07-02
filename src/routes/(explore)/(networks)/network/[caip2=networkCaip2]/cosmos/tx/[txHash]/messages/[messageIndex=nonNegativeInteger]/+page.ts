// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CosmosMessageSchema from '$/schema/CosmosMessage.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const cosmosMessageSelector = parseEntitySelector(
		schema,
		CosmosMessageSchema,
		{
			$transaction: {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				txHash: decodeURIComponent(params.txHash),
			},
			indexInTransaction: Number(params.messageIndex),
		}
	)
	if (cosmosMessageSelector instanceof arktype.errors) error(404, 'Invalid CosmosMessage selector')

	return {
		selector: cosmosMessageSelector,
	}
}
