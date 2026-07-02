// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import PolkadotBlockSchema from '$/schema/PolkadotBlock.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const polkadotBlockSelector = parseEntitySelector(
		schema,
		PolkadotBlockSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
			blockNumber: BigInt(params.blockNumber),
			hash: decodeURIComponent(params.hash),
		}
	)
	if (polkadotBlockSelector instanceof arktype.errors) error(404, 'Invalid PolkadotBlock selector')

	return {
		selector: polkadotBlockSelector,
	}
}
