import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/SuiBalanceChange.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$transaction': {
				'$network': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
				},
				digest: decodeURIComponent(params.digest),
			},
			changeIndex: decodeURIComponent(params.changeIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid SuiBalanceChange selector')

	return { selector }
}
