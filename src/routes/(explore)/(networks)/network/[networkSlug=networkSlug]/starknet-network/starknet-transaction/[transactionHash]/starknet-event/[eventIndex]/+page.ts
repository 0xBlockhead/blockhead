import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/StarknetEvent.ts'
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
				transactionHash: decodeURIComponent(params.transactionHash),
			},
			eventIndex: decodeURIComponent(params.eventIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid StarknetEvent selector')

	return { selector }
}
