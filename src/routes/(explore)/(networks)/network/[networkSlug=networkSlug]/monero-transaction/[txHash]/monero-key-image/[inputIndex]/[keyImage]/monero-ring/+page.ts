import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/MoneroRing.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$keyImage': {
				'$transaction': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
					txHash: decodeURIComponent(params.txHash),
				},
				inputIndex: decodeURIComponent(params.inputIndex),
				keyImage: decodeURIComponent(params.keyImage),
			},
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid MoneroRing selector')

	return { selector }
}
