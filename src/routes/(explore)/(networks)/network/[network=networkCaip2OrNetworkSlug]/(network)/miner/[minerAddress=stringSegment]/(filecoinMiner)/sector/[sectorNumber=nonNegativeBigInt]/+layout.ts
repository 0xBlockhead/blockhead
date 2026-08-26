// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import FilecoinSectorSchema from '$/schema/FilecoinSector.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchNonNegativeBigInt(params.sectorNumber)))
		error(404, 'Route mapping not applicable')

	const filecoinSectorFilecoinMinerSectorNumberSelector = parseRouteEntitySelector(
		schema,
		FilecoinSectorSchema,
		{
			$miner: parentData.selector,
			sectorNumber: BigInt(params.sectorNumber),
		},
		'FilecoinMinerSectorNumber'
	)
	if (filecoinSectorFilecoinMinerSectorNumberSelector instanceof arktype.errors)
		error(404, 'Invalid FilecoinSector selector')

	return {
		selector: filecoinSectorFilecoinMinerSectorNumberSelector,
	}
}
