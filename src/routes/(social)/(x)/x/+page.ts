// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XNetworkSchema from '$/schema/XNetwork.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const xNetworkSelector = parseEntitySelector(
		schema,
		XNetworkSchema,
		{
			scope: 'XNetwork',
		}
	)
	if (xNetworkSelector instanceof arktype.errors) error(404, 'Invalid XNetwork selector')

	return {
		selector: xNetworkSelector,
	}
}
