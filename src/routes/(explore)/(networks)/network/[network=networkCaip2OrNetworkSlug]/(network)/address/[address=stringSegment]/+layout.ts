// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import UtxoAddressSchema from '$/schema/UtxoAddress.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Utxo']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.ledgerModels !== undefined
			&& parentData.projectionNetwork.ledgerModels.some((value: string | number | boolean | null) => value === 'Utxo')
		)
		&& matchStringSegment(params.address)
	))
		error(404, 'Route mapping not applicable')

	const utxoAddressNetworkAddressSelector = parseRouteEntitySelector(
		schema,
		UtxoAddressSchema,
		{
			$network: parentData.selector,
			address: params.address,
		},
		'NetworkAddress'
	)
	if (utxoAddressNetworkAddressSelector instanceof arktype.errors)
		error(404, 'Invalid UtxoAddress selector')

	return {
		selector: utxoAddressNetworkAddressSelector,
	}
}
