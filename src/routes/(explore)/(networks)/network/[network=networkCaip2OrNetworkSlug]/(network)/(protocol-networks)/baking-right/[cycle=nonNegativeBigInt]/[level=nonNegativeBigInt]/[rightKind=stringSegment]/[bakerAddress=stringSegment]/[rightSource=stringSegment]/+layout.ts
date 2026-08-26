// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TezosBakingRightSchema from '$/schema/TezosBakingRight.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Tezos']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Tezos'
		&& matchNonNegativeBigInt(params.cycle)
		&& matchNonNegativeBigInt(params.level)
		&& matchStringSegment(params.rightKind)
		&& matchStringSegment(params.bakerAddress)
		&& matchStringSegment(params.rightSource)
	))
		error(404, 'Route mapping not applicable')

	const tezosBakingRightNetworkCycleLevelRightKindBakerAddressSourceSelector = parseRouteEntitySelector(
		schema,
		TezosBakingRightSchema,
		{
			$network: parentData.selector,
			cycle: BigInt(params.cycle),
			level: BigInt(params.level),
			rightKind: params.rightKind,
			bakerAddress: params.bakerAddress,
			source: params.rightSource,
		},
		'NetworkCycleLevelRightKindBakerAddressSource'
	)
	if (tezosBakingRightNetworkCycleLevelRightKindBakerAddressSourceSelector instanceof arktype.errors)
		error(404, 'Invalid TezosBakingRight selector')

	return {
		selector: tezosBakingRightNetworkCycleLevelRightKindBakerAddressSourceSelector,
	}
}
