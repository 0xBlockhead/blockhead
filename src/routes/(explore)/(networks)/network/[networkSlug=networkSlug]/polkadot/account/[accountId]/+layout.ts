// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { PolkadotAccount as PolkadotAccountSchema } from '$/schema/PolkadotAccount.ts'
import { type as arktype } from 'arktype'

// Route surface eligibility: requiredProjections=[['Polkadot']]
export const load: LayoutLoad = ({ params }) => {
	const routeSurfaceNetwork = Object.getOwnPropertyDescriptor(networkBySlug, params.networkSlug)?.value
	if (routeSurfaceNetwork == null) error(404, 'Network route surface not found')
	if (!((routeSurfaceNetwork.executionModels !== undefined && routeSurfaceNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')))) error(404, 'Network facet not available')

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
