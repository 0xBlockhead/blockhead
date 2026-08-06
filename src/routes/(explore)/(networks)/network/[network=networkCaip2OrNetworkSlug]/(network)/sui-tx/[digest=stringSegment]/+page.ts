// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SuiTransactionSchema from '$/schema/SuiTransaction.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Sui']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Sui' && matchStringSegment(params.digest)))
		error(404, 'Route mapping not applicable')

	const suiTransactionNetworkDigestSelector = parseEntitySelector(
		schema,
		SuiTransactionSchema,
		{
			$network: {
				$network: parentData.selector,
			},
			digest: params.digest,
		},
		'NetworkDigest'
	)
	if (suiTransactionNetworkDigestSelector instanceof arktype.errors)
		error(404, 'Invalid SuiTransaction selector')

	return {
		selector: suiTransactionNetworkDigestSelector,
	}
}
