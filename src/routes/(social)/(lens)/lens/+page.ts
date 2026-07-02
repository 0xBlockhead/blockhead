// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LensNetworkSchema from '$/schema/LensNetwork.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const lensNetworkSelector = parseEntitySelector(
		schema,
		LensNetworkSchema,
		{
			scope: 'LensNetwork',
		}
	)
	if (lensNetworkSelector instanceof arktype.errors) error(404, 'Invalid LensNetwork selector')

	return {
		selector: lensNetworkSelector,
	}
}
