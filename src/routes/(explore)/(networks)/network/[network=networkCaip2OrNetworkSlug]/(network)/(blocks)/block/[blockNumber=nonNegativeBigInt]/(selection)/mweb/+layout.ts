// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LitecoinMwebBlockSchema from '$/schema/LitecoinMwebBlock.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Utxo']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			(
				parentData.projectionNetwork.ledgerModels !== undefined
				&& parentData.projectionNetwork.ledgerModels.some((value: string | number | boolean | null) => value === 'Utxo')
			)
			&& parentData.projectionNetwork.namespace === 'Litecoin'
		)
	))
		error(404, 'Route mapping not applicable')

	const litecoinMwebBlockUtxoBlockSelector = parseRouteEntitySelector(
		schema,
		LitecoinMwebBlockSchema,
		{
			$block: parentData.selector,
		},
		'UtxoBlock'
	)
	if (litecoinMwebBlockUtxoBlockSelector instanceof arktype.errors)
		error(404, 'Invalid LitecoinMwebBlock selector')

	return {
		selector: litecoinMwebBlockUtxoBlockSelector,
	}
}
