import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/A2aAgentSkill.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$cardSnapshot': {
				'$card': {
					agentCardUrl: decodeURIComponent(params.agentCardUrl),
				},
				contentHashAlgorithm: decodeURIComponent(params.contentHashAlgorithm),
				contentHash: decodeURIComponent(params.contentHash),
			},
			skillId: decodeURIComponent(params.skillId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid A2aAgentSkill selector')

	return { selector }
}
