// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import PolkadotAccountSchema from '$/schema/PolkadotAccount.ts'
import { type as arktype } from 'arktype'

// Route surface eligibility: requiredFacets=['Polkadot']
export const load: LayoutLoad = ({ params }) => {
	const routeSurfaceNetwork = networkBySlug[params.networkSlug]
	if (routeSurfaceNetwork == null) error(404, 'Network route surface not found')
	if (!(routeSurfaceNetwork.executionModels.includes('PolkadotRuntime'))) error(404, 'Network facet not available')

	const polkadotAccountSelector = parseEntitySelector(
		schema,
		PolkadotAccountSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
			accountId: decodeURIComponent(params.accountId),
		}
	)
	if (polkadotAccountSelector instanceof arktype.errors) error(404, 'Invalid PolkadotAccount selector')

	return {
		selector: polkadotAccountSelector,
	}
}
