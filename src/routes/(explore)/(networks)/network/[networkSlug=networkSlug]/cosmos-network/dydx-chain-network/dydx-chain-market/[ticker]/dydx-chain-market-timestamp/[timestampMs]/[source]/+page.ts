import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/DydxChainMarket_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$market': {
				'$network': {
					'$network': {
						'$network': {
							slug: decodeURIComponent(params.networkSlug),
						},
					},
				},
				ticker: decodeURIComponent(params.ticker),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid DydxChainMarket_Timestamp selector')

	return { selector }
}
