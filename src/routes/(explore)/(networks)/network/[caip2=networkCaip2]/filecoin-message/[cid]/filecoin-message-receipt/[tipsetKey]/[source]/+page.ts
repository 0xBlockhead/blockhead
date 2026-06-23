import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/FilecoinMessageReceipt.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$message': {
				'$network': {
					caip2: caip2ParamValueFromString(params.caip2),
				},
				cid: decodeURIComponent(params.cid),
			},
			tipsetKey: decodeURIComponent(params.tipsetKey),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid FilecoinMessageReceipt selector')

	return { selector }
}
