// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import UtxoNetworkSchema from '$/schema/UtxoNetwork.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const utxoNetworkSelector = parseEntitySelector(
		schema,
		UtxoNetworkSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
		}
	)
	if (utxoNetworkSelector instanceof arktype.errors) error(404, 'Invalid UtxoNetwork selector')

	return {
		selector: utxoNetworkSelector,
	}
}
