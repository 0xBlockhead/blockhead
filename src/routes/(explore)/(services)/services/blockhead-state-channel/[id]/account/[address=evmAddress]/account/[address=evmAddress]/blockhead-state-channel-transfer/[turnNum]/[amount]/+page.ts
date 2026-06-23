import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadStateChannelTransfer.ts'
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
			'$from': {
				address: decodeURIComponent(params.address),
			},
			'$to': {
				address: decodeURIComponent(params.address),
			},
			turnNum: decodeURIComponent(params.turnNum),
			amount: decodeURIComponent(params.amount),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadStateChannelTransfer selector')

	return { selector }
}
