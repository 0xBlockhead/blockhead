// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import ZeroGKvEntrySchema from '$/schema/ZeroGKvEntry.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['ZeroG']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'ZeroG'
		&& matchStringSegment(params.namespace)
		&& matchStringSegment(params.key)
	))
		error(404, 'Route mapping not applicable')

	const zeroGKvEntryNetworkNamespaceKeySelector = parseRouteEntitySelector(
		schema,
		ZeroGKvEntrySchema,
		{
			$network: parentData.selector.$network,
			namespace: params.namespace,
			key: params.key,
		},
		'NetworkNamespaceKey'
	)
	if (zeroGKvEntryNetworkNamespaceKeySelector instanceof arktype.errors)
		error(404, 'Invalid ZeroGKvEntry selector')

	return {
		selector: zeroGKvEntryNetworkNamespaceKeySelector,
	}
}
