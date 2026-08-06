// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import IbcChannelSchema from '$/schema/IbcChannel.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Cosmos']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'CosmosSdk')
			)
			&& parentData.projectionNetwork.namespace === 'Cosmos'
		)
		&& matchStringSegment(params.portId)
		&& matchStringSegment(params.channelId)
	))
		error(404, 'Route mapping not applicable')

	const ibcChannelNetworkPortIdChannelIdSelector = parseEntitySelector(
		schema,
		IbcChannelSchema,
		{
			$network: parentData.selector,
			portId: params.portId,
			channelId: params.channelId,
		},
		'NetworkPortIdChannelId'
	)
	if (ibcChannelNetworkPortIdChannelIdSelector instanceof arktype.errors)
		error(404, 'Invalid IbcChannel selector')

	return {
		selector: ibcChannelNetworkPortIdChannelIdSelector,
	}
}
