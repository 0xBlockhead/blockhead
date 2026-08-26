// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MoneroKeyImageSchema from '$/schema/MoneroKeyImage.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Monero']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Monero'
		&& matchStringSegment(params.keyImage)
		&& matchNonNegativeInteger(params.inputIndex)
	))
		error(404, 'Route mapping not applicable')

	const moneroKeyImageMoneroTransactionInputIndexKeyImageSelector = parseRouteEntitySelector(
		schema,
		MoneroKeyImageSchema,
		{
			$transaction: parentData.selector,
			inputIndex: Number(params.inputIndex),
			keyImage: params.keyImage,
		},
		'MoneroTransactionInputIndexKeyImage'
	)
	if (moneroKeyImageMoneroTransactionInputIndexKeyImageSelector instanceof arktype.errors)
		error(404, 'Invalid MoneroKeyImage selector')

	return {
		selector: moneroKeyImageMoneroTransactionInputIndexKeyImageSelector,
	}
}
