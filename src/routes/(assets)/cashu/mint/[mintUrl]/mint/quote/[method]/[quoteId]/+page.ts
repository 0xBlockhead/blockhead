import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadCashuMintQuote.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$mint': {
				mintUrl: decodeURIComponent(params.mintUrl),
			},
			method: decodeURIComponent(params.method),
			quoteId: decodeURIComponent(params.quoteId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadCashuMintQuote selector')

	return { selector }
}
