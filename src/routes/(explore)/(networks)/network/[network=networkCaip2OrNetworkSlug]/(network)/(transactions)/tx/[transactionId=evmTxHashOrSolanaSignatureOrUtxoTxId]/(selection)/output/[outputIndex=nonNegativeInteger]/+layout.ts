// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { UtxoOutput as UtxoOutputSchema } from '$/schema/UtxoOutput.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Utxo']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!((projectionNetwork.ledgerModels !== undefined && projectionNetwork.ledgerModels.some((value: string | number | boolean | null) => value === 'Utxo')) && matchNonNegativeInteger(params.outputIndex))) error(404, 'Route mapping not applicable')

	const utxoOutputTransactionIndexInTransactionSelector = parseEntitySelector(
		schema,
		UtxoOutputSchema,
		{
			$transaction: parentData.selector,
			indexInTransaction: Number(params.outputIndex),
		}
	)
	if (utxoOutputTransactionIndexInTransactionSelector instanceof arktype.errors) error(404, 'Invalid UtxoOutput selector')

	return {
		selector: utxoOutputTransactionIndexInTransactionSelector,
	}
}
