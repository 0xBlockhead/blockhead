import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/SolanaTransaction_Timestamp.ts'
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
			slot: Number(params.slot),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid SolanaTransaction_Timestamp selector')

	return { selector }
}
