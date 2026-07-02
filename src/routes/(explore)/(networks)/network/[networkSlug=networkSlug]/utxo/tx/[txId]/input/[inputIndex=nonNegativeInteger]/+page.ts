// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import UtxoInputSchema from '$/schema/UtxoInput.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const utxoInputSelector = parseEntitySelector(
		schema,
		UtxoInputSchema,
		{
			$transaction: {
				$network: {
					slug: params.networkSlug,
				},
				txId: decodeURIComponent(params.txId),
			},
			indexInTransaction: Number(params.inputIndex),
		}
	)
	if (utxoInputSelector instanceof arktype.errors) error(404, 'Invalid UtxoInput selector')

	return {
		selector: utxoInputSelector,
	}
}
