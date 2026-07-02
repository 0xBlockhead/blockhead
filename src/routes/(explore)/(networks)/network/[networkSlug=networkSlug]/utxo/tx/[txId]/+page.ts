// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import UtxoTransactionSchema from '$/schema/UtxoTransaction.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const utxoTransactionSelector = parseEntitySelector(
		schema,
		UtxoTransactionSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
			txId: decodeURIComponent(params.txId),
		}
	)
	if (utxoTransactionSelector instanceof arktype.errors) error(404, 'Invalid UtxoTransaction selector')

	return {
		selector: utxoTransactionSelector,
	}
}
