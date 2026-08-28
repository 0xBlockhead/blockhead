// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import HederaAccountSchema from '$/schema/HederaAccount.ts'
import HederaTokenAssociation_TimestampSchema from '$/schema/HederaTokenAssociation_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import TronAccountSchema from '$/schema/TronAccount.ts'
import TronAccountTokenBalance_TimestampSchema from '$/schema/TronAccountTokenBalance_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const tronAccountTokenBalanceTimestampAccountTokenTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Tron'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
			&& matchStringSegment(params.tokenId)
		))
			return

		const tronAccountNetworkAddressParentSelector = parseRouteEntitySelector(
			schema,
			TronAccountSchema,
			parentData.selector,
			'NetworkAddress'
		)
		if (tronAccountNetworkAddressParentSelector instanceof arktype.errors)
			return

		const tronAccountTokenBalanceTimestampAccountTokenTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			TronAccountTokenBalance_TimestampSchema,
			{
				$account: tronAccountNetworkAddressParentSelector,
				$token: {
					$network: tronAccountNetworkAddressParentSelector.$network,
					tokenId: params.tokenId,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'AccountTokenTimestampMsSource'
		)
		if ((!(tronAccountTokenBalanceTimestampAccountTokenTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.TronAccountTokenBalance_Timestamp,
				selectorName: 'AccountTokenTimestampMsSource',
				selector: tronAccountTokenBalanceTimestampAccountTokenTimestampMsSourceSelector,
			} as const
	})()

	const hederaTokenAssociationTimestampAssociationTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Hedera'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
			&& matchStringSegment(params.tokenId)
		))
			return

		const hederaAccountNetworkAccountIdParentSelector = parseRouteEntitySelector(
			schema,
			HederaAccountSchema,
			parentData.selector,
			'NetworkAccountId'
		)
		if (hederaAccountNetworkAccountIdParentSelector instanceof arktype.errors)
			return

		const hederaTokenAssociationTimestampAssociationTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			HederaTokenAssociation_TimestampSchema,
			{
				$association: {
					$account: hederaAccountNetworkAccountIdParentSelector,
					$token: {
						$network: hederaAccountNetworkAccountIdParentSelector.$network,
						tokenId: params.tokenId,
					},
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'AssociationTimestampMsSource'
		)
		if ((!(hederaTokenAssociationTimestampAssociationTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.HederaTokenAssociation_Timestamp,
				selectorName: 'AssociationTimestampMsSource',
				selector: hederaTokenAssociationTimestampAssociationTimestampMsSourceSelector,
			} as const
	})()

	const routeCandidates = [
		tronAccountTokenBalanceTimestampAccountTokenTimestampMsSourceSelectorCandidate,
		hederaTokenAssociationTimestampAssociationTimestampMsSourceSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
