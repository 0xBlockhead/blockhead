// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import PolkadotPalletSchema from '$/schema/PolkadotPallet.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Polkadot']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')) && matchStringSegment(params.palletName))) error(404, 'Route mapping not applicable')

	const polkadotPalletNetworkPalletNameSelector = parseEntitySelector(
		schema,
		PolkadotPalletSchema,
		{
			$network: parentData.selector,
			palletName: params.palletName,
		}
	)
	if (polkadotPalletNetworkPalletNameSelector instanceof arktype.errors) error(404, 'Invalid PolkadotPallet selector')

	return {
		selector: polkadotPalletNetworkPalletNameSelector,
	}
}
