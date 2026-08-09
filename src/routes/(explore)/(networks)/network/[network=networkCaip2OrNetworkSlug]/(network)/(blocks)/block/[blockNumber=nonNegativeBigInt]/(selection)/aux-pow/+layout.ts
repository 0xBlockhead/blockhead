// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import DogecoinBlockAuxPowSchema from '$/schema/DogecoinBlockAuxPow.ts'
import { schema } from '$/schema/index.ts'
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
			&& parentData.projectionNetwork.namespace === 'Dogecoin'
		)
	))
		error(404, 'Route mapping not applicable')

	const dogecoinBlockAuxPowBlockSelector = parseEntitySelector(
		schema,
		DogecoinBlockAuxPowSchema,
		{
			$block: parentData.selector,
		},
		'Block'
	)
	if (dogecoinBlockAuxPowBlockSelector instanceof arktype.errors)
		error(404, 'Invalid DogecoinBlockAuxPow selector')

	return {
		selector: dogecoinBlockAuxPowBlockSelector,
	}
}
