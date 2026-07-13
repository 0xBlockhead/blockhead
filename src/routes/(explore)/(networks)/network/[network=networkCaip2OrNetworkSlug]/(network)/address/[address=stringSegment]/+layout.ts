// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { UtxoAddress as UtxoAddressSchema } from '$/schema/UtxoAddress.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Utxo']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!((projectionNetwork.ledgerModels !== undefined && projectionNetwork.ledgerModels.some((value: string | number | boolean | null) => value === 'Utxo')) && matchStringSegment(params.address))) error(404, 'Route mapping not applicable')

	const utxoAddressNetworkAddressSelector = parseEntitySelector(
		schema,
		UtxoAddressSchema,
		{
			$network: parentData.selector,
			address: params.address,
		}
	)
	if (utxoAddressNetworkAddressSelector instanceof arktype.errors) error(404, 'Invalid UtxoAddress selector')

	return {
		selector: utxoAddressNetworkAddressSelector,
	}
}
