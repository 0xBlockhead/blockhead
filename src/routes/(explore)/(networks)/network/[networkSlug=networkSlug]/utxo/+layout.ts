// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { Network as NetworkSchema } from '$/schema/Network.ts'
import { type as arktype } from 'arktype'

// Route surface eligibility: requiredProjections=[['Utxo']]
export const load: LayoutLoad = ({ params }) => {
	const routeSurfaceNetwork = Object.getOwnPropertyDescriptor(networkBySlug, params.networkSlug)?.value
	if (routeSurfaceNetwork == null) error(404, 'Network route surface not found')
	if (!((routeSurfaceNetwork.ledgerModels !== undefined && routeSurfaceNetwork.ledgerModels.some((value: string | number | boolean | null) => value === 'Utxo')))) error(404, 'Network facet not available')

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
	}
}
