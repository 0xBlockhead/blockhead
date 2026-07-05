// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import UtxoBlockSchema from '$/schema/UtxoBlock.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const utxoBlockSelector = parseEntitySelector(
		schema,
		UtxoBlockSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
			height: BigInt(params.height),
		}
	)
	if (utxoBlockSelector instanceof arktype.errors) error(404, 'Invalid UtxoBlock selector')

	return {
		selector: utxoBlockSelector,
	}
}
