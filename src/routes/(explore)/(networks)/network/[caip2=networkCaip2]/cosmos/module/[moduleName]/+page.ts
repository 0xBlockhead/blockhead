// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CosmosModuleSchema from '$/schema/CosmosModule.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const cosmosModuleSelector = parseEntitySelector(
		schema,
		CosmosModuleSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			moduleName: decodeURIComponent(params.moduleName),
		}
	)
	if (cosmosModuleSelector instanceof arktype.errors) error(404, 'Invalid CosmosModule selector')

	return {
		selector: cosmosModuleSelector,
	}
}
