// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SolanaNetworkSchema from '$/schema/SolanaNetwork.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const solanaNetworkSelector = parseEntitySelector(
		schema,
		SolanaNetworkSchema,
		{
			caip2: networkBySlug[params.networkSlug].caip2,
		}
	)
	if (solanaNetworkSelector instanceof arktype.errors) error(404, 'Invalid SolanaNetwork selector')

	return {
		selector: solanaNetworkSelector,
		title: networkBySlug[params.networkSlug].name,
	}
}
