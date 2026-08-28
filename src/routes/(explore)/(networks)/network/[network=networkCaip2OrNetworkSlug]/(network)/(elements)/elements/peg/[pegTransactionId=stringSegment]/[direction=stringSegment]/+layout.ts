// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import ElementsNetworkSchema from '$/schema/ElementsNetwork.ts'
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

	const elementsNetworkNetworkParentSelector = parseRouteEntitySelector(
		schema,
		ElementsNetworkSchema,
		parentData.selector,
		'Network'
	)
	if (elementsNetworkNetworkParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const elementsPegElementsNetworkPegTransactionIdDirectionSelector = parseRouteEntitySelector(
		schema,
		ElementsPegSchema,
		{
			$network: elementsNetworkNetworkParentSelector,
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
