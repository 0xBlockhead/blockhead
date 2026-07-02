// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SolanaTokenMintSchema from '$/schema/SolanaTokenMint.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const solanaTokenMintSelector = parseEntitySelector(
		schema,
		SolanaTokenMintSchema,
		{
			$network: {
				caip2: networkBySlug[params.networkSlug].caip2,
			},
			mintAddress: decodeURIComponent(params.mintAddress),
		}
	)
	if (solanaTokenMintSelector instanceof arktype.errors) error(404, 'Invalid SolanaTokenMint selector')

	return {
		selector: solanaTokenMintSelector,
	}
}
