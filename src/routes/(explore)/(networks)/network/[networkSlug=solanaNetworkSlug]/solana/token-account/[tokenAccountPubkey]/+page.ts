// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SolanaTokenAccountSchema from '$/schema/SolanaTokenAccount.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const solanaTokenAccountSelector = parseEntitySelector(
		schema,
		SolanaTokenAccountSchema,
		{
			$network: {
				caip2: networkBySlug[params.networkSlug].caip2,
			},
			tokenAccountPubkey: decodeURIComponent(params.tokenAccountPubkey),
		}
	)
	if (solanaTokenAccountSelector instanceof arktype.errors) error(404, 'Invalid SolanaTokenAccount selector')

	return {
		selector: solanaTokenAccountSelector,
	}
}
