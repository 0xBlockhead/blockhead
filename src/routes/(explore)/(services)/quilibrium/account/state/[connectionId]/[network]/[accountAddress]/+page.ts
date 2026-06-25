import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadQuilibriumAccountState.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			connectionId: decodeURIComponent(params.connectionId),
			network: decodeURIComponent(params.network),
			accountAddress: decodeURIComponent(params.accountAddress),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadQuilibriumAccountState selector')

	return { selector }
}
