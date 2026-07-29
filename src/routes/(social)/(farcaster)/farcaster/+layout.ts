// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import FarcasterNetworkSchema from '$/schema/FarcasterNetwork.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const farcasterNetworkScopeSelector = parseEntitySelector(
		schema,
		FarcasterNetworkSchema,
		{
			scope: 'FarcasterNetwork',
		}
	)
	if (farcasterNetworkScopeSelector instanceof arktype.errors)
		error(404, 'Invalid FarcasterNetwork selector')

	return {
		selector: farcasterNetworkScopeSelector,
	}
}
