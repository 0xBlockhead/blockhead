import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/Eip8004CrossRegistration.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$registrationFile': {
				'$registration': {
					namespace: decodeURIComponent(params.namespace),
					chainId: decodeURIComponent(params.chainId),
					identityRegistry: decodeURIComponent(params.identityRegistry),
					agentId: decodeURIComponent(params.agentId),
				},
				contentHashAlgorithm: decodeURIComponent(params.contentHashAlgorithm),
				contentHash: decodeURIComponent(params.contentHash),
			},
			targetKind: decodeURIComponent(params.targetKind),
			targetSelectorHashAlgorithm: decodeURIComponent(params.targetSelectorHashAlgorithm),
			targetSelectorHash: decodeURIComponent(params.targetSelectorHash),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid Eip8004CrossRegistration selector')

	return { selector }
}
