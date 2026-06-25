import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/AiModelVersion.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$model': {
				'$provider': {
					providerId: decodeURIComponent(params.providerId),
				},
				providerModelId: decodeURIComponent(params.providerModelId),
			},
			versionId: decodeURIComponent(params.versionId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid AiModelVersion selector')

	return { selector }
}
