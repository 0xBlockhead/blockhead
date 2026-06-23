import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/LitecoinMwebPegOut.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$transaction': {
				'$mwebBlock': {
					'$block': {
						'$network': {
							caip2: caip2ParamValueFromString(params.caip2),
						},
						height: Number(params.height),
						hash: decodeURIComponent(params.hash),
					},
				},
				transactionIndex: decodeURIComponent(params.transactionIndex),
			},
			pegOutIndex: decodeURIComponent(params.pegOutIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid LitecoinMwebPegOut selector')

	return { selector }
}
