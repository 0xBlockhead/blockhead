import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadCashuMintQuote_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$mintQuote': {
				'$mint': {
					mintUrl: decodeURIComponent(params.mintUrl),
				},
				method: decodeURIComponent(params.method),
				quoteId: decodeURIComponent(params.quoteId),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadCashuMintQuote_Timestamp selector')

	return { selector }
}
