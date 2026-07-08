// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { PolkadotBlock as PolkadotBlockSchema } from '$/schema/PolkadotBlock.ts'
import { type as arktype } from 'arktype'

// Route surface eligibility: requiredProjections=[['Polkadot']]
export const load: LayoutLoad = ({ params }) => {
	const routeSurfaceNetwork = Object.getOwnPropertyDescriptor(networkBySlug, params.networkSlug)?.value
	if (routeSurfaceNetwork == null) error(404, 'Network route surface not found')
	if (!((routeSurfaceNetwork.executionModels !== undefined && routeSurfaceNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')))) error(404, 'Network facet not available')

	const polkadotBlockSelector = parseEntitySelector(
		schema,
		PolkadotBlockSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
			blockNumber: BigInt(params.blockNumber),
			hash: decodeURIComponent(params.hash),
		}
	)
	if (polkadotBlockSelector instanceof arktype.errors) error(404, 'Invalid PolkadotBlock selector')

	return {
		selector: polkadotBlockSelector,
	}
}
