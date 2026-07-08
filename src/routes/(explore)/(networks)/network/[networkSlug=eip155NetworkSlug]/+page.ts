// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { Network as NetworkSchema } from '$/schema/Network.ts'
import { type as arktype } from 'arktype'

// Route surface eligibility: requiredProjections=[['Evm']]
export const load: PageLoad = ({ params }) => {
	const routeSurfaceNetwork = Object.getOwnPropertyDescriptor(networkBySlug, params.networkSlug)?.value
	if (routeSurfaceNetwork == null) error(404, 'Network route surface not found')
	if (!((routeSurfaceNetwork.executionModels !== undefined && routeSurfaceNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')))) error(404, 'Network facet not available')

	const networkSelector = parseEntitySelector(
		schema,
		NetworkSchema,
		{
			caip2: routeSurfaceNetwork.caip2,
		}
	)
	if (networkSelector instanceof arktype.errors) error(404, 'Invalid Network selector')

	return {
		selector: networkSelector,
		title: networkBySlug[params.networkSlug].name,
	}
}
