// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import UtxoOutputSchema from '$/schema/UtxoOutput.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const utxoOutputSelector = parseEntitySelector(
		schema,
		UtxoOutputSchema,
		{
			$transaction: {
				$network: {
					slug: params.networkSlug,
				},
				txId: decodeURIComponent(params.txId),
			},
			indexInTransaction: Number(params.outputIndex),
		}
	)
	if (utxoOutputSelector instanceof arktype.errors) error(404, 'Invalid UtxoOutput selector')

	return {
		selector: utxoOutputSelector,
	}
}
