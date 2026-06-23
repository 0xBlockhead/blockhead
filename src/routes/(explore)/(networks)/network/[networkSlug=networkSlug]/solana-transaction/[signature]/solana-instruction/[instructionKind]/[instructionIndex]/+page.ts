import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/SolanaInstruction.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$transaction': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
				signature: decodeURIComponent(params.signature),
			},
			instructionKind: decodeURIComponent(params.instructionKind),
			instructionIndex: decodeURIComponent(params.instructionIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid SolanaInstruction selector')

	return { selector }
}
