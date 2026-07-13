// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { LensNetwork as LensNetworkSchema } from '$/schema/LensNetwork.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const lensNetworkScopeSelector = parseEntitySelector(
		schema,
		LensNetworkSchema,
		{
			scope: 'LensNetwork',
		}
	)
	if (lensNetworkScopeSelector instanceof arktype.errors) error(404, 'Invalid LensNetwork selector')

	return {
		selector: lensNetworkScopeSelector,
	}
}
