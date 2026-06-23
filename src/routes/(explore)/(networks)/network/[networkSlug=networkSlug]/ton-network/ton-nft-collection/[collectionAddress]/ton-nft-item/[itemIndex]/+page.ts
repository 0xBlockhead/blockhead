import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/TonNftItem.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$collection': {
				'$network': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
				},
				collectionAddress: decodeURIComponent(params.collectionAddress),
			},
			itemIndex: decodeURIComponent(params.itemIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid TonNftItem selector')

	return { selector }
}
