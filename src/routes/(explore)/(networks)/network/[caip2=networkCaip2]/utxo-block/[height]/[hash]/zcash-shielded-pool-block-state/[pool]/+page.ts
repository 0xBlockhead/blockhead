import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/ZcashShieldedPoolBlockState.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$block': {
				'$network': {
					caip2: caip2ParamValueFromString(params.caip2),
				},
				height: Number(params.height),
				hash: decodeURIComponent(params.hash),
			},
			pool: decodeURIComponent(params.pool),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid ZcashShieldedPoolBlockState selector')

	return { selector }
}
