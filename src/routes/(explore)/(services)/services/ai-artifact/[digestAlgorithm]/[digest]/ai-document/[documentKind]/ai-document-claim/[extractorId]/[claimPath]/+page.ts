import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/AiDocumentClaim.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$document': {
				'$artifact': {
					digestAlgorithm: decodeURIComponent(params.digestAlgorithm),
					digest: decodeURIComponent(params.digest),
				},
				documentKind: decodeURIComponent(params.documentKind),
			},
			extractorId: decodeURIComponent(params.extractorId),
			claimPath: decodeURIComponent(params.claimPath),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid AiDocumentClaim selector')

	return { selector }
}
