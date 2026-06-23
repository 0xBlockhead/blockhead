import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadStateChannelState.ts'
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
			version: Number(params.version),
			stateData: decodeURIComponent(params.stateData),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadStateChannelState selector')

	return { selector }
}
