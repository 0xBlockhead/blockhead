// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MoneroKeyImageSchema from '$/schema/MoneroKeyImage.ts'
import MoneroRingSchema from '$/schema/MoneroRing.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const moneroKeyImageMoneroTransactionInputIndexKeyImageParentSelector = parseRouteEntitySelector(
		schema,
		MoneroKeyImageSchema,
		parentData.selector,
		'MoneroTransactionInputIndexKeyImage'
	)
	if (moneroKeyImageMoneroTransactionInputIndexKeyImageParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const moneroRingMoneroKeyImageSelector = parseRouteEntitySelector(
		schema,
		MoneroRingSchema,
		{
			$keyImage: moneroKeyImageMoneroTransactionInputIndexKeyImageParentSelector,
		},
		'MoneroKeyImage'
	)
	if (moneroRingMoneroKeyImageSelector instanceof arktype.errors)
		error(404, 'Invalid MoneroRing selector')

	return {
		selector: moneroRingMoneroKeyImageSelector,
	}
}
