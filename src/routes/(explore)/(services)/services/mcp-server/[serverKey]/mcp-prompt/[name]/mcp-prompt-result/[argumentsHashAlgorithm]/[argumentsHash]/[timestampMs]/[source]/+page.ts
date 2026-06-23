import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/McpPromptResult.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$prompt': {
				'$server': {
					serverKey: decodeURIComponent(params.serverKey),
				},
				name: decodeURIComponent(params.name),
			},
			argumentsHashAlgorithm: decodeURIComponent(params.argumentsHashAlgorithm),
			argumentsHash: decodeURIComponent(params.argumentsHash),
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid McpPromptResult selector')

	return { selector }
}
