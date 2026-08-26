// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BeaconDataColumnSchema from '$/schema/BeaconDataColumn.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchNonNegativeInteger(params.columnIndex)))
		error(404, 'Route mapping not applicable')

	const beaconDataColumnBlockColumnIndexSelector = parseRouteEntitySelector(
		schema,
		BeaconDataColumnSchema,
		{
			$block: parentData.selector,
			columnIndex: Number(params.columnIndex),
		},
		'BlockColumnIndex'
	)
	if (beaconDataColumnBlockColumnIndexSelector instanceof arktype.errors)
		error(404, 'Invalid BeaconDataColumn selector')

	return {
		selector: beaconDataColumnBlockColumnIndexSelector,
	}
}
