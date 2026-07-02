// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SolanaAccountSchema from '$/schema/SolanaAccount.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const solanaAccountSelector = parseEntitySelector(
		schema,
		SolanaAccountSchema,
		{
			$network: {
				caip2: networkBySlug[params.networkSlug].caip2,
			},
			pubkey: decodeURIComponent(params.pubkey),
		}
	)
	if (solanaAccountSelector instanceof arktype.errors) error(404, 'Invalid SolanaAccount selector')

	return {
		selector: solanaAccountSelector,
	}
}
