import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/XrplTrustline.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$network': {
				'$network': {
					caip2: caip2ParamValueFromString(params.caip2),
				},
			},
			account: decodeURIComponent(params.account),
			currency: decodeURIComponent(params.currency),
			issuer: decodeURIComponent(params.issuer),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid XrplTrustline selector')

	return { selector }
}
