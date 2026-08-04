// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchPolkadotAccountId } from '$/params/polkadotAccountId.ts'
import { match as matchSolanaPubkey } from '$/params/solanaPubkey.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import AptosAccountSchema from '$/schema/AptosAccount.ts'
import CardanoAddressSchema from '$/schema/CardanoAddress.ts'
import CosmosAccountSchema from '$/schema/CosmosAccount.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmNetworkAccountSchema from '$/schema/EvmNetworkAccount.ts'
import HederaAccountSchema from '$/schema/HederaAccount.ts'
import { schema } from '$/schema/index.ts'
import PolkadotAccountSchema from '$/schema/PolkadotAccount.ts'
import SolanaAccountSchema from '$/schema/SolanaAccount.ts'
import StarknetContractSchema from '$/schema/StarknetContract.ts'
import TonAccountSchema from '$/schema/TonAccount.ts'
import TronAccountSchema from '$/schema/TronAccount.ts'
import XrplAccountSchema from '$/schema/XrplAccount.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const routeCandidates: (
		| {
			readonly entityType: EntityType.AptosAccount
			readonly selectorName: 'NetworkAddress'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.AptosAccount,
				'NetworkAddress'
			>
		}
		| {
			readonly entityType: EntityType.PolkadotAccount
			readonly selectorName: 'NetworkAccountId'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.PolkadotAccount,
				'NetworkAccountId'
			>
		}
		| {
			readonly entityType: EntityType.CosmosAccount
			readonly selectorName: 'NetworkAddress'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.CosmosAccount,
				'NetworkAddress'
			>
		}
		| {
			readonly entityType: EntityType.HederaAccount
			readonly selectorName: 'NetworkAccountId'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.HederaAccount,
				'NetworkAccountId'
			>
		}
		| {
			readonly entityType: EntityType.CardanoAddress
			readonly selectorName: 'NetworkAddress'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.CardanoAddress,
				'NetworkAddress'
			>
		}
		| {
			readonly entityType: EntityType.EvmNetworkAccount
			readonly selectorName: 'EvmNetworkEvmAccount'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.EvmNetworkAccount,
				'EvmNetworkEvmAccount'
			>
		}
		| {
			readonly entityType: EntityType.SolanaAccount
			readonly selectorName: 'NetworkPubkey'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.SolanaAccount,
				'NetworkPubkey'
			>
		}
		| {
			readonly entityType: EntityType.StarknetContract
			readonly selectorName: 'NetworkAddress'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.StarknetContract,
				'NetworkAddress'
			>
		}
		| {
			readonly entityType: EntityType.TronAccount
			readonly selectorName: 'NetworkAddress'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.TronAccount,
				'NetworkAddress'
			>
		}
		| {
			readonly entityType: EntityType.TonAccount
			readonly selectorName: 'NetworkAddress'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.TonAccount,
				'NetworkAddress'
			>
		}
		| {
			readonly entityType: EntityType.XrplAccount
			readonly selectorName: 'NetworkAccount'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.XrplAccount,
				'NetworkAccount'
			>
		}
	)[] = []

	if (parentData.projectionNetwork.namespace === 'Aptos' && matchStringSegment(params.accountId)) {
		const aptosAccountNetworkAddressSelector = parseEntitySelector(
			schema,
			AptosAccountSchema,
			{
				$network: {
					$network: parentData.selector,
				},
				address: params.accountId,
			},
			'NetworkAddress'
		)
		if (!(aptosAccountNetworkAddressSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.AptosAccount,
				selectorName: 'NetworkAddress',
				selector: aptosAccountNetworkAddressSelector,
			})
	}

	if (
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')
			)
			&& parentData.projectionNetwork.namespace === 'Polkadot'
		)
		&& matchPolkadotAccountId(params.accountId)
	) {
		const polkadotAccountNetworkAccountIdSelector = parseEntitySelector(
			schema,
			PolkadotAccountSchema,
			{
				$network: parentData.selector,
				accountId: params.accountId,
			},
			'NetworkAccountId'
		)
		if (!(polkadotAccountNetworkAccountIdSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.PolkadotAccount,
				selectorName: 'NetworkAccountId',
				selector: polkadotAccountNetworkAccountIdSelector,
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
		&& matchStringSegment(params.accountId)
	) {
		const cosmosAccountNetworkAddressSelector = parseEntitySelector(
			schema,
			CosmosAccountSchema,
			{
				$network: parentData.selector,
				address: params.accountId,
			},
			'NetworkAddress'
		)
		if (!(cosmosAccountNetworkAddressSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.CosmosAccount,
				selectorName: 'NetworkAddress',
				selector: cosmosAccountNetworkAddressSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Hedera' && matchStringSegment(params.accountId)) {
		const hederaAccountNetworkAccountIdSelector = parseEntitySelector(
			schema,
			HederaAccountSchema,
			{
				$network: parentData.selector,
				accountId: params.accountId,
			},
			'NetworkAccountId'
		)
		if (!(hederaAccountNetworkAccountIdSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.HederaAccount,
				selectorName: 'NetworkAccountId',
				selector: hederaAccountNetworkAccountIdSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Cardano' && matchStringSegment(params.accountId)) {
		const cardanoAddressNetworkAddressSelector = parseEntitySelector(
			schema,
			CardanoAddressSchema,
			{
				$network: parentData.selector,
				address: params.accountId,
			},
			'NetworkAddress'
		)
		if (!(cardanoAddressNetworkAddressSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.CardanoAddress,
				selectorName: 'NetworkAddress',
				selector: cardanoAddressNetworkAddressSelector,
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
		&& matchEvmAddress(params.accountId)
	) {
		const evmNetworkAccountEvmNetworkEvmAccountSelector = parseEntitySelector(
			schema,
			EvmNetworkAccountSchema,
			{
				$network: parentData.selector,
				$actor: {
					address: params.accountId,
				},
			},
			'EvmNetworkEvmAccount'
		)
		if (!(evmNetworkAccountEvmNetworkEvmAccountSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.EvmNetworkAccount,
				selectorName: 'EvmNetworkEvmAccount',
				selector: evmNetworkAccountEvmNetworkEvmAccountSelector,
			})
	}

	if (
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'SolanaRuntime')
			)
			&& parentData.projectionNetwork.namespace === 'Solana'
		)
		&& matchSolanaPubkey(params.accountId)
	) {
		const solanaAccountNetworkPubkeySelector = parseEntitySelector(
			schema,
			SolanaAccountSchema,
			{
				$network: parentData.selector,
				pubkey: params.accountId,
			},
			'NetworkPubkey'
		)
		if (!(solanaAccountNetworkPubkeySelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.SolanaAccount,
				selectorName: 'NetworkPubkey',
				selector: solanaAccountNetworkPubkeySelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Starknet' && matchStringSegment(params.accountId)) {
		const starknetContractNetworkAddressSelector = parseEntitySelector(
			schema,
			StarknetContractSchema,
			{
				$network: {
					$network: parentData.selector,
				},
				address: params.accountId,
			},
			'NetworkAddress'
		)
		if (!(starknetContractNetworkAddressSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.StarknetContract,
				selectorName: 'NetworkAddress',
				selector: starknetContractNetworkAddressSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Tron' && matchStringSegment(params.accountId)) {
		const tronAccountNetworkAddressSelector = parseEntitySelector(
			schema,
			TronAccountSchema,
			{
				$network: parentData.selector,
				address: params.accountId,
			},
			'NetworkAddress'
		)
		if (!(tronAccountNetworkAddressSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.TronAccount,
				selectorName: 'NetworkAddress',
				selector: tronAccountNetworkAddressSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Ton' && matchStringSegment(params.accountId)) {
		const tonAccountNetworkAddressSelector = parseEntitySelector(
			schema,
			TonAccountSchema,
			{
				$network: parentData.selector,
				address: params.accountId,
			},
			'NetworkAddress'
		)
		if (!(tonAccountNetworkAddressSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.TonAccount,
				selectorName: 'NetworkAddress',
				selector: tonAccountNetworkAddressSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Xrpl' && matchStringSegment(params.accountId)) {
		const xrplAccountNetworkAccountSelector = parseEntitySelector(
			schema,
			XrplAccountSchema,
			{
				$network: parentData.selector,
				account: params.accountId,
			},
			'NetworkAccount'
		)
		if (!(xrplAccountNetworkAccountSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.XrplAccount,
				selectorName: 'NetworkAccount',
				selector: xrplAccountNetworkAccountSelector,
			})
	}

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
