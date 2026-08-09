// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import ElementsPegSchema from '$/schema/ElementsPeg.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Elements']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Elements'
		&& matchStringSegment(params.pegTransactionId)
		&& matchStringSegment(params.direction)
	))
		error(404, 'Route mapping not applicable')

	const elementsPegElementsNetworkPegTransactionIdDirectionSelector = parseEntitySelector(
		schema,
		ElementsPegSchema,
		{
			$network: parentData.selector,
			pegTransactionId: params.pegTransactionId,
			direction: params.direction,
		},
		'ElementsNetworkPegTransactionIdDirection'
	)
	if (elementsPegElementsNetworkPegTransactionIdDirectionSelector instanceof arktype.errors)
		error(404, 'Invalid ElementsPeg selector')

	return {
		selector: elementsPegElementsNetworkPegTransactionIdDirectionSelector,
	}
}
