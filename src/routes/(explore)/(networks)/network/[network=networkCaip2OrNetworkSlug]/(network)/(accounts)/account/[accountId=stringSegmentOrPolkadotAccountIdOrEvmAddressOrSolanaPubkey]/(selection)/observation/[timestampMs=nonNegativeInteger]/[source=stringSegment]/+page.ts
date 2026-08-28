// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import CosmosAccount_TimestampSchema from '$/schema/CosmosAccount_Timestamp.ts'
import CosmosAccountSchema from '$/schema/CosmosAccount.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmNetworkAccount_TimestampSchema from '$/schema/EvmNetworkAccount_Timestamp.ts'
import EvmNetworkAccountSchema from '$/schema/EvmNetworkAccount.ts'
import HederaAccount_TimestampSchema from '$/schema/HederaAccount_Timestamp.ts'
import HederaAccountSchema from '$/schema/HederaAccount.ts'
import { schema } from '$/schema/index.ts'
import PolkadotAccount_TimestampSchema from '$/schema/PolkadotAccount_Timestamp.ts'
import PolkadotAccountSchema from '$/schema/PolkadotAccount.ts'
import TonAccount_TimestampSchema from '$/schema/TonAccount_Timestamp.ts'
import TonAccountSchema from '$/schema/TonAccount.ts'
import TronAccount_TimestampSchema from '$/schema/TronAccount_Timestamp.ts'
import TronAccountSchema from '$/schema/TronAccount.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const polkadotAccountTimestampAccountTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')
				)
				&& parentData.projectionNetwork.namespace === 'Polkadot'
			)
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const polkadotAccountNetworkAccountIdParentSelector = parseRouteEntitySelector(
			schema,
			PolkadotAccountSchema,
			parentData.selector,
			'NetworkAccountId'
		)
		if (polkadotAccountNetworkAccountIdParentSelector instanceof arktype.errors)
			return

		const polkadotAccountTimestampAccountTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			PolkadotAccount_TimestampSchema,
			{
				$account: polkadotAccountNetworkAccountIdParentSelector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'AccountTimestampMsSource'
		)
		if ((!(polkadotAccountTimestampAccountTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.PolkadotAccount_Timestamp,
				selectorName: 'AccountTimestampMsSource',
				selector: polkadotAccountTimestampAccountTimestampMsSourceSelector,
			} as const
	})()

	const cosmosAccountTimestampAccountTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'CosmosSdk')
				)
				&& parentData.projectionNetwork.namespace === 'Cosmos'
			)
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const cosmosAccountNetworkAddressParentSelector = parseRouteEntitySelector(
			schema,
			CosmosAccountSchema,
			parentData.selector,
			'NetworkAddress'
		)
		if (cosmosAccountNetworkAddressParentSelector instanceof arktype.errors)
			return

		const cosmosAccountTimestampAccountTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			CosmosAccount_TimestampSchema,
			{
				$account: cosmosAccountNetworkAddressParentSelector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'AccountTimestampMsSource'
		)
		if ((!(cosmosAccountTimestampAccountTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.CosmosAccount_Timestamp,
				selectorName: 'AccountTimestampMsSource',
				selector: cosmosAccountTimestampAccountTimestampMsSourceSelector,
			} as const
	})()

	const evmNetworkAccountTimestampAccountTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
				)
				&& parentData.projectionNetwork.namespace === 'Evm'
			)
			&& matchStringSegment(params.source)
			&& matchNonNegativeInteger(params.timestampMs)
		))
			return

		const evmNetworkAccountEvmNetworkEvmAccountParentSelector = parseRouteEntitySelector(
			schema,
			EvmNetworkAccountSchema,
			parentData.selector,
			'EvmNetworkEvmAccount'
		)
		if (evmNetworkAccountEvmNetworkEvmAccountParentSelector instanceof arktype.errors)
			return

		const evmNetworkAccountTimestampAccountTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			EvmNetworkAccount_TimestampSchema,
			{
				$account: evmNetworkAccountEvmNetworkEvmAccountParentSelector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'AccountTimestampMsSource'
		)
		if ((!(evmNetworkAccountTimestampAccountTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.EvmNetworkAccount_Timestamp,
				selectorName: 'AccountTimestampMsSource',
				selector: evmNetworkAccountTimestampAccountTimestampMsSourceSelector,
			} as const
	})()

	const hederaAccountTimestampAccountTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Hedera'
			&& matchStringSegment(params.source)
			&& matchNonNegativeInteger(params.timestampMs)
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

		const hederaAccountTimestampAccountTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			HederaAccount_TimestampSchema,
			{
				$account: hederaAccountNetworkAccountIdParentSelector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'AccountTimestampMsSource'
		)
		if ((!(hederaAccountTimestampAccountTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.HederaAccount_Timestamp,
				selectorName: 'AccountTimestampMsSource',
				selector: hederaAccountTimestampAccountTimestampMsSourceSelector,
			} as const
	})()

	const tonAccountTimestampAccountTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Ton'
			&& matchStringSegment(params.source)
			&& matchNonNegativeInteger(params.timestampMs)
		))
			return

		const tonAccountNetworkAddressParentSelector = parseRouteEntitySelector(
			schema,
			TonAccountSchema,
			parentData.selector,
			'NetworkAddress'
		)
		if (tonAccountNetworkAddressParentSelector instanceof arktype.errors)
			return

		const tonAccountTimestampAccountTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			TonAccount_TimestampSchema,
			{
				$account: tonAccountNetworkAddressParentSelector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'AccountTimestampMsSource'
		)
		if ((!(tonAccountTimestampAccountTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.TonAccount_Timestamp,
				selectorName: 'AccountTimestampMsSource',
				selector: tonAccountTimestampAccountTimestampMsSourceSelector,
			} as const
	})()

	const tronAccountTimestampAccountTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Tron'
			&& matchStringSegment(params.source)
			&& matchNonNegativeInteger(params.timestampMs)
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

		const tronAccountTimestampAccountTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			TronAccount_TimestampSchema,
			{
				$account: tronAccountNetworkAddressParentSelector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'AccountTimestampMsSource'
		)
		if ((!(tronAccountTimestampAccountTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.TronAccount_Timestamp,
				selectorName: 'AccountTimestampMsSource',
				selector: tronAccountTimestampAccountTimestampMsSourceSelector,
			} as const
	})()

	const routeCandidates = [
		polkadotAccountTimestampAccountTimestampMsSourceSelectorCandidate,
		cosmosAccountTimestampAccountTimestampMsSourceSelectorCandidate,
		evmNetworkAccountTimestampAccountTimestampMsSourceSelectorCandidate,
		hederaAccountTimestampAccountTimestampMsSourceSelectorCandidate,
		tonAccountTimestampAccountTimestampMsSourceSelectorCandidate,
		tronAccountTimestampAccountTimestampMsSourceSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
