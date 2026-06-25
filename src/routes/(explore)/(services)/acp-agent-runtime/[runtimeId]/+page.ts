import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/AcpAgentRuntime.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			runtimeId: decodeURIComponent(params.runtimeId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid AcpAgentRuntime selector')

	return { selector }
}
