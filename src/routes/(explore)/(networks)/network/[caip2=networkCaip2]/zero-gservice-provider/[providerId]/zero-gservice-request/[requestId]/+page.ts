import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/ZeroGServiceRequest.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$serviceProvider': {
				'$network': {
					caip2: caip2ParamValueFromString(params.caip2),
				},
				providerId: decodeURIComponent(params.providerId),
			},
			requestId: decodeURIComponent(params.requestId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid ZeroGServiceRequest selector')

	return { selector }
}
