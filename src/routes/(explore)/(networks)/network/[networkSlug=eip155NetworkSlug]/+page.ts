// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmNetworkSchema from '$/schema/EvmNetwork.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmNetworkSelector = parseEntitySelector(
		schema,
		EvmNetworkSchema,
		{
			caip2: networkBySlug[params.networkSlug].caip2,
		}
	)
	if (evmNetworkSelector instanceof arktype.errors) error(404, 'Invalid EvmNetwork selector')

	return {
		selector: evmNetworkSelector,
		title: networkBySlug[params.networkSlug].name,
	}
}
