import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadStateChannelDeposit.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$channel': {
				id: decodeURIComponent(params.id),
			},
			'$account': {
				address: decodeURIComponent(params.address),
				interopAddress: decodeURIComponent(params.interopAddress),
			},
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadStateChannelDeposit selector')

	return { selector }
}
