import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BitcoinCashBcmrMetadata.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$network': {
				slug: decodeURIComponent(params.networkSlug),
			},
			categoryId: decodeURIComponent(params.categoryId),
			registryUrl: decodeURIComponent(params.registryUrl),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BitcoinCashBcmrMetadata selector')

	return { selector }
}
