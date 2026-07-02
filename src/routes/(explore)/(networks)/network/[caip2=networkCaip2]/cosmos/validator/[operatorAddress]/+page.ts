// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CosmosValidatorSchema from '$/schema/CosmosValidator.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const cosmosValidatorSelector = parseEntitySelector(
		schema,
		CosmosValidatorSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			operatorAddress: decodeURIComponent(params.operatorAddress),
		}
	)
	if (cosmosValidatorSelector instanceof arktype.errors) error(404, 'Invalid CosmosValidator selector')

	return {
		selector: cosmosValidatorSelector,
	}
}
