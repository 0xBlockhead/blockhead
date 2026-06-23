import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/PolkadotExtrinsic.ts'
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
			},
			extrinsicIndex: decodeURIComponent(params.extrinsicIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid PolkadotExtrinsic selector')

	return { selector }
}
