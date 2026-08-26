// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import HederaTokenSchema from '$/schema/HederaToken.ts'
import { schema } from '$/schema/index.ts'
import TronTokenSchema from '$/schema/TronToken.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const hederaTokenNetworkTokenIdSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Hedera' && matchStringSegment(params.tokenId)))
			return

		const hederaTokenNetworkTokenIdSelector = parseRouteEntitySelector(
			schema,
			HederaTokenSchema,
			{
				$network: parentData.selector,
				tokenId: params.tokenId,
			},
			'NetworkTokenId'
		)
		if ((!(hederaTokenNetworkTokenIdSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.HederaToken,
				selectorName: 'NetworkTokenId',
				selector: hederaTokenNetworkTokenIdSelector,
			} as const
	})()

	const tronTokenNetworkTokenIdSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Tron' && matchStringSegment(params.tokenId)))
			return

		const tronTokenNetworkTokenIdSelector = parseRouteEntitySelector(
			schema,
			TronTokenSchema,
			{
				$network: parentData.selector,
				tokenId: params.tokenId,
			},
			'NetworkTokenId'
		)
		if ((!(tronTokenNetworkTokenIdSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.TronToken,
				selectorName: 'NetworkTokenId',
				selector: tronTokenNetworkTokenIdSelector,
			} as const
	})()

	const routeCandidates = [
		hederaTokenNetworkTokenIdSelectorCandidate,
		tronTokenNetworkTokenIdSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
