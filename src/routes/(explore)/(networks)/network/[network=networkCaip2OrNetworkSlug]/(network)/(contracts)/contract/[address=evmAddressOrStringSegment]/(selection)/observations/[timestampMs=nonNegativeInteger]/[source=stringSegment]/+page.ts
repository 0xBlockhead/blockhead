// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import HederaContract_TimestampSchema from '$/schema/HederaContract_Timestamp.ts'
import HederaContractSchema from '$/schema/HederaContract.ts'
import { schema } from '$/schema/index.ts'
import NearContract_TimestampSchema from '$/schema/NearContract_Timestamp.ts'
import NearContractSchema from '$/schema/NearContract.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const hederaContractTimestampContractTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Hedera'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const hederaContractNetworkContractIdParentSelector = parseRouteEntitySelector(
			schema,
			HederaContractSchema,
			parentData.selector,
			'NetworkContractId'
		)
		if (hederaContractNetworkContractIdParentSelector instanceof arktype.errors)
			return

		const hederaContractTimestampContractTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			HederaContract_TimestampSchema,
			{
				$contract: hederaContractNetworkContractIdParentSelector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'ContractTimestampMsSource'
		)
		if ((!(hederaContractTimestampContractTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.HederaContract_Timestamp,
				selectorName: 'ContractTimestampMsSource',
				selector: hederaContractTimestampContractTimestampMsSourceSelector,
			} as const
	})()

	const nearContractTimestampContractTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Near'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const nearContractNetworkAccountIdParentSelector = parseRouteEntitySelector(
			schema,
			NearContractSchema,
			parentData.selector,
			'NetworkAccountId'
		)
		if (nearContractNetworkAccountIdParentSelector instanceof arktype.errors)
			return

		const nearContractTimestampContractTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			NearContract_TimestampSchema,
			{
				$contract: nearContractNetworkAccountIdParentSelector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'ContractTimestampMsSource'
		)
		if ((!(nearContractTimestampContractTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.NearContract_Timestamp,
				selectorName: 'ContractTimestampMsSource',
				selector: nearContractTimestampContractTimestampMsSourceSelector,
			} as const
	})()

	const routeCandidates = [
		hederaContractTimestampContractTimestampMsSourceSelectorCandidate,
		nearContractTimestampContractTimestampMsSourceSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
