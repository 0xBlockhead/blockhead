// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SolanaTokenAccountSchema from '$/schema/SolanaTokenAccount.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Solana']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'SolanaRuntime')
		)
		&& matchStringSegment(params.tokenAccountPubkey)
	))
		error(404, 'Route mapping not applicable')

	const solanaTokenAccountNetworkTokenAccountPubkeySelector = parseEntitySelector(
		schema,
		SolanaTokenAccountSchema,
		{
			$network: parentData.selector,
			tokenAccountPubkey: params.tokenAccountPubkey,
		}
	)
	if (solanaTokenAccountNetworkTokenAccountPubkeySelector instanceof arktype.errors)
		error(404, 'Invalid SolanaTokenAccount selector')

	return {
		selector: solanaTokenAccountNetworkTokenAccountPubkeySelector,
	}
}
