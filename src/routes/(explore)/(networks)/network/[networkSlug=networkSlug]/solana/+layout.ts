// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NetworkSchema from '$/schema/Network.ts'
import { type as arktype } from 'arktype'

// Route surface eligibility: requiredFacets=['Solana']
export const load: LayoutLoad = ({ params }) => {
	const routeSurfaceNetwork = networkBySlug[params.networkSlug]
	if (routeSurfaceNetwork == null) error(404, 'Network route surface not found')
	if (!(routeSurfaceNetwork.executionModels.includes('SolanaRuntime'))) error(404, 'Network facet not available')

	const networkSelector = parseEntitySelector(
		schema,
		NetworkSchema,
		{
			slug: params.networkSlug,
		}
	)
	if (networkSelector instanceof arktype.errors) error(404, 'Invalid Network selector')

	return {
		selector: networkSelector,
		title: routeSurfaceNetwork.name,
	}
}
