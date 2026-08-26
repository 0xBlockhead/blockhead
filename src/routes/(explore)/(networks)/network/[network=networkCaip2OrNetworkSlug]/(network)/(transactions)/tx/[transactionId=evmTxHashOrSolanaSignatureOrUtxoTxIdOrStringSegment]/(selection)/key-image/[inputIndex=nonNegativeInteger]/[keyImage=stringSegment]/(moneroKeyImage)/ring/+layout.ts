// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MoneroRingSchema from '$/schema/MoneroRing.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const moneroRingMoneroKeyImageSelector = parseRouteEntitySelector(
		schema,
		MoneroRingSchema,
		{
			$keyImage: parentData.selector,
		},
		'MoneroKeyImage'
	)
	if (moneroRingMoneroKeyImageSelector instanceof arktype.errors)
		error(404, 'Invalid MoneroRing selector')

	return {
		selector: moneroRingMoneroKeyImageSelector,
	}
}
