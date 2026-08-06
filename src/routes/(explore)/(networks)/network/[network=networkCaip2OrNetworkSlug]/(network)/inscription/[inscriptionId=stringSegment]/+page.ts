// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BitcoinOrdinalInscriptionSchema from '$/schema/BitcoinOrdinalInscription.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Utxo']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			(
				parentData.projectionNetwork.ledgerModels !== undefined
				&& parentData.projectionNetwork.ledgerModels.some((value: string | number | boolean | null) => value === 'Utxo')
			)
			&& parentData.projectionNetwork.namespace === 'Bitcoin'
		)
		&& matchStringSegment(params.inscriptionId)
	))
		error(404, 'Route mapping not applicable')

	const bitcoinOrdinalInscriptionNetworkInscriptionIdSelector = parseEntitySelector(
		schema,
		BitcoinOrdinalInscriptionSchema,
		{
			$network: parentData.selector,
			inscriptionId: params.inscriptionId,
		},
		'NetworkInscriptionId'
	)
	if (bitcoinOrdinalInscriptionNetworkInscriptionIdSelector instanceof arktype.errors)
		error(404, 'Invalid BitcoinOrdinalInscription selector')

	return {
		selector: bitcoinOrdinalInscriptionNetworkInscriptionIdSelector,
	}
}
