// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import PolkadotExtrinsicSchema from '$/schema/PolkadotExtrinsic.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const polkadotExtrinsicSelector = parseEntitySelector(
		schema,
		PolkadotExtrinsicSchema,
		{
			$block: {
				$network: {
					slug: params.networkSlug,
				},
				blockNumber: BigInt(params.blockNumber),
				hash: decodeURIComponent(params.hash),
			},
			indexInBlock: Number(params.extrinsicIndex),
		}
	)
	if (polkadotExtrinsicSelector instanceof arktype.errors) error(404, 'Invalid PolkadotExtrinsic selector')

	return {
		selector: polkadotExtrinsicSelector,
	}
}
