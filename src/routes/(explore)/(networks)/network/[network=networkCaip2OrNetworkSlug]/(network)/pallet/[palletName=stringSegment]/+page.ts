// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import PolkadotPalletSchema from '$/schema/PolkadotPallet.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Polkadot']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')
		)
		&& matchStringSegment(params.palletName)
	))
		error(404, 'Route mapping not applicable')

	const polkadotPalletNetworkPalletNameSelector = parseRouteEntitySelector(
		schema,
		PolkadotPalletSchema,
		{
			$network: parentData.selector,
			palletName: params.palletName,
		},
		'NetworkPalletName'
	)
	if (polkadotPalletNetworkPalletNameSelector instanceof arktype.errors)
		error(404, 'Invalid PolkadotPallet selector')

	return {
		selector: polkadotPalletNetworkPalletNameSelector,
	}
}
