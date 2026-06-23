import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/SolanaTokenMint_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$mint': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
				mintAddress: decodeURIComponent(params.mintAddress),
			},
			slot: Number(params.slot),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid SolanaTokenMint_Timestamp selector')

	return { selector }
}
