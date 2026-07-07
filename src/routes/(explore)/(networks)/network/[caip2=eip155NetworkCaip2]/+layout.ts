// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2 } from '$/constants/Network.ts'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NetworkSchema from '$/schema/Network.ts'
import { type as arktype } from 'arktype'

// Route surface eligibility: requiredFacets=['Evm']
export const load: LayoutLoad = ({ params }) => {
	const routeSurfaceNetwork = networkByCaip2[decodeURIComponent(params.caip2)]
	if (routeSurfaceNetwork == null) error(404, 'Network route surface not found')
	if (!(routeSurfaceNetwork.executionModels.includes('Evm'))) error(404, 'Network facet not available')

	const networkSelector = parseEntitySelector(
		schema,
		NetworkSchema,
		{
			caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
		}
	)
	if (networkSelector instanceof arktype.errors) error(404, 'Invalid Network selector')

	return {
		selector: networkSelector,
		title: routeSurfaceNetwork.name,
	}
}
