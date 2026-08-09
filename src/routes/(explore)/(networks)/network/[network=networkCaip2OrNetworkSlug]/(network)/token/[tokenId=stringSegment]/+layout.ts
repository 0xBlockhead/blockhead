// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import HederaTokenSchema from '$/schema/HederaToken.ts'
import { schema } from '$/schema/index.ts'
import TronTokenSchema from '$/schema/TronToken.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const routeCandidates: (
		| {
			readonly entityType: EntityType.HederaToken
			readonly selectorName: 'NetworkTokenId'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.HederaToken,
				'NetworkTokenId'
			>
		}
		| {
			readonly entityType: EntityType.TronToken
			readonly selectorName: 'NetworkTokenId'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.TronToken,
				'NetworkTokenId'
			>
		}
	)[] = []

	if (parentData.projectionNetwork.namespace === 'Hedera' && matchStringSegment(params.tokenId)) {
		const hederaTokenNetworkTokenIdSelector = parseEntitySelector(
			schema,
			HederaTokenSchema,
			{
				$network: parentData.selector,
				tokenId: params.tokenId,
			},
			'NetworkTokenId'
		)
		if (!(hederaTokenNetworkTokenIdSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.HederaToken,
				selectorName: 'NetworkTokenId',
				selector: hederaTokenNetworkTokenIdSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Tron' && matchStringSegment(params.tokenId)) {
		const tronTokenNetworkTokenIdSelector = parseEntitySelector(
			schema,
			TronTokenSchema,
			{
				$network: parentData.selector,
				tokenId: params.tokenId,
			},
			'NetworkTokenId'
		)
		if (!(tronTokenNetworkTokenIdSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.TronToken,
				selectorName: 'NetworkTokenId',
				selector: tronTokenNetworkTokenIdSelector,
			})
	}

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
