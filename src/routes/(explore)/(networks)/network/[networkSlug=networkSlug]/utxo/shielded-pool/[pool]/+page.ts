// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { ZcashShieldedPool as ZcashShieldedPoolSchema } from '$/schema/ZcashShieldedPool.ts'
import { type as arktype } from 'arktype'

// Route surface eligibility: requiredProjections=[['Utxo'], ['Zcash']]
export const load: PageLoad = ({ params }) => {
	const routeSurfaceNetwork = Object.getOwnPropertyDescriptor(networkBySlug, params.networkSlug)?.value
	if (routeSurfaceNetwork == null) error(404, 'Network route surface not found')
	if (!((routeSurfaceNetwork.ledgerModels !== undefined && routeSurfaceNetwork.ledgerModels.some((value: string | number | boolean | null) => value === 'Utxo')) && (routeSurfaceNetwork.executionModels !== undefined && routeSurfaceNetwork.executionModels.some((value: string | number | boolean | null) => value === 'ZcashShielded')))) error(404, 'Network facet not available')

	const zcashShieldedPoolSelector = parseEntitySelector(
		schema,
		ZcashShieldedPoolSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
			pool: decodeURIComponent(params.pool),
		}
	)
	if (zcashShieldedPoolSelector instanceof arktype.errors) error(404, 'Invalid ZcashShieldedPool selector')

	return {
		selector: zcashShieldedPoolSelector,
	}
}
