import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/LitecoinMwebOutput.ts'
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
							slug: decodeURIComponent(params.networkSlug),
						},
						height: Number(params.height),
						hash: decodeURIComponent(params.hash),
					},
				},
				transactionIndex: decodeURIComponent(params.transactionIndex),
			},
			outputIndex: decodeURIComponent(params.outputIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid LitecoinMwebOutput selector')

	return { selector }
}
