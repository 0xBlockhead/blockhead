import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/PolkadotEvent.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$block': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
				blockNumber: BigInt(params.blockNumber),
				hash: decodeURIComponent(params.hash),
			},
			eventIndex: decodeURIComponent(params.eventIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid PolkadotEvent selector')

	return { selector }
}
