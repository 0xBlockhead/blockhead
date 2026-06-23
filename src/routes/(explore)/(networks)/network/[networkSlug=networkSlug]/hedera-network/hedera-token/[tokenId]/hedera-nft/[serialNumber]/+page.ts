import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/HederaNft.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$token': {
				'$network': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
				},
				tokenId: decodeURIComponent(params.tokenId),
			},
			serialNumber: decodeURIComponent(params.serialNumber),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid HederaNft selector')

	return { selector }
}
