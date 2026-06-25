import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/Eip8004AgentRegistration.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			namespace: decodeURIComponent(params.namespace),
			chainId: decodeURIComponent(params.chainId),
			identityRegistry: decodeURIComponent(params.identityRegistry),
			agentId: decodeURIComponent(params.agentId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid Eip8004AgentRegistration selector')

	return { selector }
}
