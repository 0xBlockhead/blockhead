// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BitcoinMiningPoolSchema from '$/schema/BitcoinMiningPool.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Utxo']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			(
				parentData.projectionNetwork.ledgerModels !== undefined
				&& parentData.projectionNetwork.ledgerModels.some((value: string | number | boolean | null) => value === 'Utxo')
			)
			&& parentData.projectionNetwork.namespace === 'Bitcoin'
		)
		&& matchStringSegment(params.slug)
	))
		error(404, 'Route mapping not applicable')

	const bitcoinMiningPoolNetworkSlugSelector = parseEntitySelector(
		schema,
		BitcoinMiningPoolSchema,
		{
			$network: parentData.selector,
			slug: params.slug,
		},
		'NetworkSlug'
	)
	if (bitcoinMiningPoolNetworkSlugSelector instanceof arktype.errors)
		error(404, 'Invalid BitcoinMiningPool selector')

	return {
		selector: bitcoinMiningPoolNetworkSlugSelector,
	}
}
