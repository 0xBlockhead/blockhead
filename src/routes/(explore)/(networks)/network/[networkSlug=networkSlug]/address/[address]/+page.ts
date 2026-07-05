// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import UtxoAddressSchema from '$/schema/UtxoAddress.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const utxoAddressSelector = parseEntitySelector(
		schema,
		UtxoAddressSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
			address: decodeURIComponent(params.address),
		}
	)
	if (utxoAddressSelector instanceof arktype.errors) error(404, 'Invalid UtxoAddress selector')

	return {
		selector: utxoAddressSelector,
	}
}
