// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import StellarAccountSignerSchema from '$/schema/StellarAccountSigner.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Stellar']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Stellar'
		&& matchStringSegment(params.signerKey)
		&& matchStringSegment(params.signerType)
	))
		error(404, 'Route mapping not applicable')

	const stellarAccountSignerAccountSignerKeySignerTypeSelector = parseRouteEntitySelector(
		schema,
		StellarAccountSignerSchema,
		{
			$account: parentData.selector,
			signerKey: params.signerKey,
			signerType: params.signerType,
		},
		'AccountSignerKeySignerType'
	)
	if (stellarAccountSignerAccountSignerKeySignerTypeSelector instanceof arktype.errors)
		error(404, 'Invalid StellarAccountSigner selector')

	return {
		selector: stellarAccountSignerAccountSignerKeySignerTypeSelector,
	}
}
