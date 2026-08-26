// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchPolkadotAccountId } from '$/params/polkadotAccountId.ts'
import { match as matchSolanaPubkey } from '$/params/solanaPubkey.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AptosAccountSchema from '$/schema/AptosAccount.ts'
import CosmosAccountSchema from '$/schema/CosmosAccount.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmNetworkAccountSchema from '$/schema/EvmNetworkAccount.ts'
import HederaAccountSchema from '$/schema/HederaAccount.ts'
import HyperliquidAccountSchema from '$/schema/HyperliquidAccount.ts'
import { schema } from '$/schema/index.ts'
import NearAccountSchema from '$/schema/NearAccount.ts'
import PolkadotAccountSchema from '$/schema/PolkadotAccount.ts'
import QuilibriumAccountSchema from '$/schema/QuilibriumAccount.ts'
import SolanaAccountSchema from '$/schema/SolanaAccount.ts'
import StarknetContractSchema from '$/schema/StarknetContract.ts'
import TonAccountSchema from '$/schema/TonAccount.ts'
import TronAccountSchema from '$/schema/TronAccount.ts'
import XrplAccountSchema from '$/schema/XrplAccount.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const aptosAccountNetworkAddressSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Aptos' && matchStringSegment(params.accountId)))
			return

		const aptosAccountNetworkAddressSelector = parseRouteEntitySelector(
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
		if ((!(aptosAccountNetworkAddressSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.AptosAccount,
				selectorName: 'NetworkAddress',
				selector: aptosAccountNetworkAddressSelector,
			} as const
	})()

	const polkadotAccountNetworkAccountIdSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')
				)
				&& parentData.projectionNetwork.namespace === 'Polkadot'
			)
			&& matchPolkadotAccountId(params.accountId)
		))
			return

		const polkadotAccountNetworkAccountIdSelector = parseRouteEntitySelector(
			schema,
			PolkadotAccountSchema,
			{
				$network: parentData.selector,
				accountId: params.accountId,
			},
			'NetworkAccountId'
		)
		if ((!(polkadotAccountNetworkAccountIdSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.PolkadotAccount,
				selectorName: 'NetworkAccountId',
				selector: polkadotAccountNetworkAccountIdSelector,
			} as const
	})()

	const cosmosAccountNetworkAddressSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'CosmosSdk')
				)
				&& parentData.projectionNetwork.namespace === 'Cosmos'
			)
			&& matchStringSegment(params.accountId)
		))
			return

		const cosmosAccountNetworkAddressSelector = parseRouteEntitySelector(
			schema,
			CosmosAccountSchema,
			{
				$network: parentData.selector,
				address: params.accountId,
			},
			'NetworkAddress'
		)
		if ((!(cosmosAccountNetworkAddressSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.CosmosAccount,
				selectorName: 'NetworkAddress',
				selector: cosmosAccountNetworkAddressSelector,
			} as const
	})()

	const hederaAccountNetworkAccountIdSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Hedera' && matchStringSegment(params.accountId)))
			return

		const hederaAccountNetworkAccountIdSelector = parseRouteEntitySelector(
			schema,
			HederaAccountSchema,
			{
				$network: parentData.selector,
				accountId: params.accountId,
			},
			'NetworkAccountId'
		)
		if ((!(hederaAccountNetworkAccountIdSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.HederaAccount,
				selectorName: 'NetworkAccountId',
				selector: hederaAccountNetworkAccountIdSelector,
			} as const
	})()

	const evmNetworkAccountEvmNetworkEvmAccountSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
				)
				&& parentData.projectionNetwork.namespace === 'Evm'
			)
			&& matchEvmAddress(params.accountId)
		))
			return

		const evmNetworkAccountEvmNetworkEvmAccountSelector = parseRouteEntitySelector(
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
		if ((!(evmNetworkAccountEvmNetworkEvmAccountSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.EvmNetworkAccount,
				selectorName: 'EvmNetworkEvmAccount',
				selector: evmNetworkAccountEvmNetworkEvmAccountSelector,
			} as const
	})()

	const solanaAccountNetworkPubkeySelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'SolanaRuntime')
				)
				&& parentData.projectionNetwork.namespace === 'Solana'
			)
			&& matchSolanaPubkey(params.accountId)
		))
			return

		const solanaAccountNetworkPubkeySelector = parseRouteEntitySelector(
			schema,
			SolanaAccountSchema,
			{
				$network: parentData.selector,
				pubkey: params.accountId,
			},
			'NetworkPubkey'
		)
		if ((!(solanaAccountNetworkPubkeySelector instanceof arktype.errors)))
			return {
				entityType: EntityType.SolanaAccount,
				selectorName: 'NetworkPubkey',
				selector: solanaAccountNetworkPubkeySelector,
			} as const
	})()

	const starknetContractNetworkAddressSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Starknet' && matchStringSegment(params.accountId)))
			return

		const starknetContractNetworkAddressSelector = parseRouteEntitySelector(
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
		if ((!(starknetContractNetworkAddressSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.StarknetContract,
				selectorName: 'NetworkAddress',
				selector: starknetContractNetworkAddressSelector,
			} as const
	})()

	const tronAccountNetworkAddressSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Tron' && matchStringSegment(params.accountId)))
			return

		const tronAccountNetworkAddressSelector = parseRouteEntitySelector(
			schema,
			TronAccountSchema,
			{
				$network: parentData.selector,
				address: params.accountId,
			},
			'NetworkAddress'
		)
		if ((!(tronAccountNetworkAddressSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.TronAccount,
				selectorName: 'NetworkAddress',
				selector: tronAccountNetworkAddressSelector,
			} as const
	})()

	const tonAccountNetworkAddressSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Ton' && matchStringSegment(params.accountId)))
			return

		const tonAccountNetworkAddressSelector = parseRouteEntitySelector(
			schema,
			TonAccountSchema,
			{
				$network: parentData.selector,
				address: params.accountId,
			},
			'NetworkAddress'
		)
		if ((!(tonAccountNetworkAddressSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.TonAccount,
				selectorName: 'NetworkAddress',
				selector: tonAccountNetworkAddressSelector,
			} as const
	})()

	const xrplAccountNetworkAccountSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Xrpl' && matchStringSegment(params.accountId)))
			return

		const xrplAccountNetworkAccountSelector = parseRouteEntitySelector(
			schema,
			XrplAccountSchema,
			{
				$network: parentData.selector,
				account: params.accountId,
			},
			'NetworkAccount'
		)
		if ((!(xrplAccountNetworkAccountSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.XrplAccount,
				selectorName: 'NetworkAccount',
				selector: xrplAccountNetworkAccountSelector,
			} as const
	})()

	const nearAccountNetworkAccountIdSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Near' && matchStringSegment(params.accountId)))
			return

		const nearAccountNetworkAccountIdSelector = parseRouteEntitySelector(
			schema,
			NearAccountSchema,
			{
				$network: parentData.selector,
				accountId: params.accountId,
			},
			'NetworkAccountId'
		)
		if ((!(nearAccountNetworkAccountIdSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.NearAccount,
				selectorName: 'NetworkAccountId',
				selector: nearAccountNetworkAccountIdSelector,
			} as const
	})()

	const hyperliquidAccountNetworkAddressSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Hyperliquid'
			&& (
				matchStringSegment(params.accountId)
				|| matchPolkadotAccountId(params.accountId)
				|| matchEvmAddress(params.accountId)
				|| matchSolanaPubkey(params.accountId)
			)
		))
			return

		const hyperliquidAccountNetworkAddressSelector = parseRouteEntitySelector(
			schema,
			HyperliquidAccountSchema,
			{
				$network: parentData.selector,
				address: params.accountId,
			},
			'NetworkAddress'
		)
		if ((!(hyperliquidAccountNetworkAddressSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.HyperliquidAccount,
				selectorName: 'NetworkAddress',
				selector: hyperliquidAccountNetworkAddressSelector,
			} as const
	})()

	const quilibriumAccountNetworkAccountAddressSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Quilibrium' && matchStringSegment(params.accountId)))
			return

		const quilibriumAccountNetworkAccountAddressSelector = parseRouteEntitySelector(
			schema,
			QuilibriumAccountSchema,
			{
				$network: parentData.selector,
				accountAddress: params.accountId,
			},
			'NetworkAccountAddress'
		)
		if ((!(quilibriumAccountNetworkAccountAddressSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.QuilibriumAccount,
				selectorName: 'NetworkAccountAddress',
				selector: quilibriumAccountNetworkAccountAddressSelector,
			} as const
	})()

	const routeCandidates = [
		aptosAccountNetworkAddressSelectorCandidate,
		polkadotAccountNetworkAccountIdSelectorCandidate,
		cosmosAccountNetworkAddressSelectorCandidate,
		hederaAccountNetworkAccountIdSelectorCandidate,
		evmNetworkAccountEvmNetworkEvmAccountSelectorCandidate,
		solanaAccountNetworkPubkeySelectorCandidate,
		starknetContractNetworkAddressSelectorCandidate,
		tronAccountNetworkAddressSelectorCandidate,
		tonAccountNetworkAddressSelectorCandidate,
		xrplAccountNetworkAccountSelectorCandidate,
		nearAccountNetworkAccountIdSelectorCandidate,
		hyperliquidAccountNetworkAddressSelectorCandidate,
		quilibriumAccountNetworkAccountAddressSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
