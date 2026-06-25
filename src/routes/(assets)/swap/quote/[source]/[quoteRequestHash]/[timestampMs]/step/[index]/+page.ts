import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/SwapQuoteStep.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$quote': {
				source: decodeURIComponent(params.source),
				quoteRequestHash: decodeURIComponent(params.quoteRequestHash),
				timestampMs: Number(params.timestampMs),
			},
			index: Number(params.index),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid SwapQuoteStep selector')

	return { selector }
}
