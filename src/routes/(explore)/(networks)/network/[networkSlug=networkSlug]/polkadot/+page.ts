// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import PolkadotNetworkSchema from '$/schema/PolkadotNetwork.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const polkadotNetworkSelector = parseEntitySelector(
		schema,
		PolkadotNetworkSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
		}
	)
	if (polkadotNetworkSelector instanceof arktype.errors) error(404, 'Invalid PolkadotNetwork selector')

	return {
		selector: polkadotNetworkSelector,
	}
}
