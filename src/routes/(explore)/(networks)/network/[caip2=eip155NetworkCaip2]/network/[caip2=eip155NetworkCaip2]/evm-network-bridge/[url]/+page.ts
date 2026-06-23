import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/EvmNetworkBridge.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$fromNetwork': {
				caip2: caip2ParamValueFromString(params.caip2),
			},
			'$toNetwork': {
				caip2: caip2ParamValueFromString(params.caip2),
			},
			url: decodeURIComponent(params.url),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid EvmNetworkBridge selector')

	return { selector }
}
