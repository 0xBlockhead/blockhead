import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/Eip8004AgentServiceEndpoint.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$registrationFile': {
				'$artifact': {
					digestAlgorithm: decodeURIComponent(params.digestAlgorithm),
					digest: decodeURIComponent(params.digest),
				},
			},
			endpointKind: decodeURIComponent(params.endpointKind),
			endpointUrl: decodeURIComponent(params.endpointUrl),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid Eip8004AgentServiceEndpoint selector')

	return { selector }
}
