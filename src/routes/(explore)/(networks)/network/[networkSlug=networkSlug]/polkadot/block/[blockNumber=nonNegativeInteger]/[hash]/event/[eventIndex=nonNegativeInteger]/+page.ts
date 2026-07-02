// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import PolkadotEventSchema from '$/schema/PolkadotEvent.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const polkadotEventSelector = parseEntitySelector(
		schema,
		PolkadotEventSchema,
		{
			$block: {
				$network: {
					slug: params.networkSlug,
				},
				blockNumber: BigInt(params.blockNumber),
				hash: decodeURIComponent(params.hash),
			},
			indexInBlock: Number(params.eventIndex),
		}
	)
	if (polkadotEventSelector instanceof arktype.errors) error(404, 'Invalid PolkadotEvent selector')

	return {
		selector: polkadotEventSelector,
	}
}
