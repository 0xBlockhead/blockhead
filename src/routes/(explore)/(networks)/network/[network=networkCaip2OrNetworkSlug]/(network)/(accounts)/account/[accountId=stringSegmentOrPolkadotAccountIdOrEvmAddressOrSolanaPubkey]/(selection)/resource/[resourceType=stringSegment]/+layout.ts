// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AptosAccountSchema from '$/schema/AptosAccount.ts'
import AptosAccountResourceSchema from '$/schema/AptosAccountResource.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Aptos']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Aptos' && matchStringSegment(params.resourceType)))
		error(404, 'Route mapping not applicable')

	const aptosAccountNetworkAddressParentSelector = parseRouteEntitySelector(
		schema,
		AptosAccountSchema,
		parentData.selector,
		'NetworkAddress'
	)
	if (aptosAccountNetworkAddressParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const aptosAccountResourceAccountResourceTypeSelector = parseRouteEntitySelector(
		schema,
		AptosAccountResourceSchema,
		{
			$account: aptosAccountNetworkAddressParentSelector,
			resourceType: params.resourceType,
		},
		'AccountResourceType'
	)
	if (aptosAccountResourceAccountResourceTypeSelector instanceof arktype.errors)
		error(404, 'Invalid AptosAccountResource selector')

	return {
		selector: aptosAccountResourceAccountResourceTypeSelector,
	}
}
