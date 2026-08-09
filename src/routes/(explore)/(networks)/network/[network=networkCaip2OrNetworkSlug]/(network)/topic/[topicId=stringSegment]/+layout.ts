// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import HederaTopicSchema from '$/schema/HederaTopic.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Hedera']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Hedera' && matchStringSegment(params.topicId)))
		error(404, 'Route mapping not applicable')

	const hederaTopicNetworkTopicIdSelector = parseEntitySelector(
		schema,
		HederaTopicSchema,
		{
			$network: parentData.selector,
			topicId: params.topicId,
		},
		'NetworkTopicId'
	)
	if (hederaTopicNetworkTopicIdSelector instanceof arktype.errors)
		error(404, 'Invalid HederaTopic selector')

	return {
		selector: hederaTopicNetworkTopicIdSelector,
	}
}
