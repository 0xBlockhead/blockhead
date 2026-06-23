import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BitcoinCashCashTokenNft.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$output': {
				'$transaction': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
					txId: decodeURIComponent(params.txId),
				},
				outputIndex: decodeURIComponent(params.outputIndex),
			},
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BitcoinCashCashTokenNft selector')

	return { selector }
}
