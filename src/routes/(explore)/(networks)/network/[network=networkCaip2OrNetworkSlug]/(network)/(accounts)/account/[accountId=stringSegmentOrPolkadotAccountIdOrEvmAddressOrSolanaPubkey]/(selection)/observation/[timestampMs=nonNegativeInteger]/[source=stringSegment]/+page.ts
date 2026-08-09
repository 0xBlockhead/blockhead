// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import CosmosAccount_TimestampSchema from '$/schema/CosmosAccount_Timestamp.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmNetworkAccount_TimestampSchema from '$/schema/EvmNetworkAccount_Timestamp.ts'
import HederaAccount_TimestampSchema from '$/schema/HederaAccount_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import PolkadotAccount_TimestampSchema from '$/schema/PolkadotAccount_Timestamp.ts'
import TonAccount_TimestampSchema from '$/schema/TonAccount_Timestamp.ts'
import TronAccount_TimestampSchema from '$/schema/TronAccount_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const routeCandidates: (
		| {
			readonly entityType: EntityType.PolkadotAccount_Timestamp
			readonly selectorName: 'AccountTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.PolkadotAccount_Timestamp,
				'AccountTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.CosmosAccount_Timestamp
			readonly selectorName: 'AccountTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.CosmosAccount_Timestamp,
				'AccountTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.EvmNetworkAccount_Timestamp
			readonly selectorName: 'AccountTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.EvmNetworkAccount_Timestamp,
				'AccountTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.HederaAccount_Timestamp
			readonly selectorName: 'AccountTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.HederaAccount_Timestamp,
				'AccountTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.TonAccount_Timestamp
			readonly selectorName: 'AccountTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.TonAccount_Timestamp,
				'AccountTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.TronAccount_Timestamp
			readonly selectorName: 'AccountTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.TronAccount_Timestamp,
				'AccountTimestampMsSource'
			>
		}
	)[] = []

	if (
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')
			)
			&& parentData.projectionNetwork.namespace === 'Polkadot'
		)
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const polkadotAccountTimestampAccountTimestampMsSourceSelector = parseEntitySelector(
			schema,
			PolkadotAccount_TimestampSchema,
			{
				$account: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'AccountTimestampMsSource'
		)
		if (!(polkadotAccountTimestampAccountTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.PolkadotAccount_Timestamp,
				selectorName: 'AccountTimestampMsSource',
				selector: polkadotAccountTimestampAccountTimestampMsSourceSelector,
			})
	}

	if (
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'CosmosSdk')
			)
			&& parentData.projectionNetwork.namespace === 'Cosmos'
		)
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const cosmosAccountTimestampAccountTimestampMsSourceSelector = parseEntitySelector(
			schema,
			CosmosAccount_TimestampSchema,
			{
				$account: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'AccountTimestampMsSource'
		)
		if (!(cosmosAccountTimestampAccountTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.CosmosAccount_Timestamp,
				selectorName: 'AccountTimestampMsSource',
				selector: cosmosAccountTimestampAccountTimestampMsSourceSelector,
			})
	}

	if (
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
			)
			&& parentData.projectionNetwork.namespace === 'Evm'
		)
		&& matchStringSegment(params.source)
		&& matchNonNegativeInteger(params.timestampMs)
	) {
		const evmNetworkAccountTimestampAccountTimestampMsSourceSelector = parseEntitySelector(
			schema,
			EvmNetworkAccount_TimestampSchema,
			{
				$account: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'AccountTimestampMsSource'
		)
		if (!(evmNetworkAccountTimestampAccountTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.EvmNetworkAccount_Timestamp,
				selectorName: 'AccountTimestampMsSource',
				selector: evmNetworkAccountTimestampAccountTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Hedera'
		&& matchStringSegment(params.source)
		&& matchNonNegativeInteger(params.timestampMs)
	) {
		const hederaAccountTimestampAccountTimestampMsSourceSelector = parseEntitySelector(
			schema,
			HederaAccount_TimestampSchema,
			{
				$account: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'AccountTimestampMsSource'
		)
		if (!(hederaAccountTimestampAccountTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.HederaAccount_Timestamp,
				selectorName: 'AccountTimestampMsSource',
				selector: hederaAccountTimestampAccountTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Ton'
		&& matchStringSegment(params.source)
		&& matchNonNegativeInteger(params.timestampMs)
	) {
		const tonAccountTimestampAccountTimestampMsSourceSelector = parseEntitySelector(
			schema,
			TonAccount_TimestampSchema,
			{
				$account: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'AccountTimestampMsSource'
		)
		if (!(tonAccountTimestampAccountTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.TonAccount_Timestamp,
				selectorName: 'AccountTimestampMsSource',
				selector: tonAccountTimestampAccountTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Tron'
		&& matchStringSegment(params.source)
		&& matchNonNegativeInteger(params.timestampMs)
	) {
		const tronAccountTimestampAccountTimestampMsSourceSelector = parseEntitySelector(
			schema,
			TronAccount_TimestampSchema,
			{
				$account: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'AccountTimestampMsSource'
		)
		if (!(tronAccountTimestampAccountTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.TronAccount_Timestamp,
				selectorName: 'AccountTimestampMsSource',
				selector: tronAccountTimestampAccountTimestampMsSourceSelector,
			})
	}

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
