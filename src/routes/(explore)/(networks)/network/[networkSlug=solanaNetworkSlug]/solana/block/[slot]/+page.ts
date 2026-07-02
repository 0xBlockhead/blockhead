// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SolanaBlockSchema from '$/schema/SolanaBlock.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const solanaBlockSelector = parseEntitySelector(
		schema,
		SolanaBlockSchema,
		{
			$network: {
				caip2: networkBySlug[params.networkSlug].caip2,
			},
			slot: BigInt(params.slot),
		}
	)
	if (solanaBlockSelector instanceof arktype.errors) error(404, 'Invalid SolanaBlock selector')

	return {
		selector: solanaBlockSelector,
	}
}
