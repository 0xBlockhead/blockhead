// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchPolkadotAccountId } from '$/params/polkadotAccountId.ts'
import { match as matchSolanaPubkey } from '$/params/solanaPubkey.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import { CardanoAddress as CardanoAddressSchema } from '$/schema/CardanoAddress.ts'
import { CosmosAccount as CosmosAccountSchema } from '$/schema/CosmosAccount.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmNetworkAccount as EvmNetworkAccountSchema } from '$/schema/EvmNetworkAccount.ts'
import { HederaAccount as HederaAccountSchema } from '$/schema/HederaAccount.ts'
import { schema } from '$/schema/index.ts'
import { PolkadotAccount as PolkadotAccountSchema } from '$/schema/PolkadotAccount.ts'
import { SolanaAccount as SolanaAccountSchema } from '$/schema/SolanaAccount.ts'
import { TonAccount as TonAccountSchema } from '$/schema/TonAccount.ts'
import { XrplAccount as XrplAccountSchema } from '$/schema/XrplAccount.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	const routeCandidates: (
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

	if (((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')) && projectionNetwork.namespace === 'Polkadot') && matchPolkadotAccountId(params.accountId)) {
		const polkadotAccountNetworkAccountIdSelector = parseEntitySelector(
			schema,
			PolkadotAccountSchema,
			{
				$network: parentData.selector,
				accountId: params.accountId,
			}
		)
		if (!(polkadotAccountNetworkAccountIdSelector instanceof arktype.errors) && '$network' in polkadotAccountNetworkAccountIdSelector && 'accountId' in polkadotAccountNetworkAccountIdSelector)
			routeCandidates.push({ entityType: EntityType.PolkadotAccount, selectorName: 'NetworkAccountId', selector: polkadotAccountNetworkAccountIdSelector })
	}

	if (((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'CosmosSdk')) && projectionNetwork.namespace === 'Cosmos') && matchStringSegment(params.accountId)) {
		const cosmosAccountNetworkAddressSelector = parseEntitySelector(
			schema,
			CosmosAccountSchema,
			{
				$network: parentData.selector,
				address: params.accountId,
			}
		)
		if (!(cosmosAccountNetworkAddressSelector instanceof arktype.errors) && '$network' in cosmosAccountNetworkAddressSelector && 'address' in cosmosAccountNetworkAddressSelector)
			routeCandidates.push({ entityType: EntityType.CosmosAccount, selectorName: 'NetworkAddress', selector: cosmosAccountNetworkAddressSelector })
	}

	if ((projectionNetwork.namespace === 'Hedera' && projectionNetwork.namespace === 'Hedera') && matchStringSegment(params.accountId)) {
		const hederaAccountNetworkAccountIdSelector = parseEntitySelector(
			schema,
			HederaAccountSchema,
			{
				$network: parentData.selector,
				accountId: params.accountId,
			}
		)
		if (!(hederaAccountNetworkAccountIdSelector instanceof arktype.errors) && '$network' in hederaAccountNetworkAccountIdSelector && 'accountId' in hederaAccountNetworkAccountIdSelector)
			routeCandidates.push({ entityType: EntityType.HederaAccount, selectorName: 'NetworkAccountId', selector: hederaAccountNetworkAccountIdSelector })
	}

	if (projectionNetwork.namespace === 'Cardano' && matchStringSegment(params.accountId)) {
		const cardanoAddressNetworkAddressSelector = parseEntitySelector(
			schema,
			CardanoAddressSchema,
			{
				$network: parentData.selector,
				address: params.accountId,
			}
		)
		if (!(cardanoAddressNetworkAddressSelector instanceof arktype.errors) && '$network' in cardanoAddressNetworkAddressSelector && 'address' in cardanoAddressNetworkAddressSelector)
			routeCandidates.push({ entityType: EntityType.CardanoAddress, selectorName: 'NetworkAddress', selector: cardanoAddressNetworkAddressSelector })
	}

	if (((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')) && projectionNetwork.namespace === 'Evm') && matchEvmAddress(params.accountId)) {
		const evmNetworkAccountEvmNetworkEvmAccountSelector = parseEntitySelector(
			schema,
			EvmNetworkAccountSchema,
			{
				$network: parentData.selector,
				$actor: {
					address: params.accountId,
				},
			}
		)
		if (!(evmNetworkAccountEvmNetworkEvmAccountSelector instanceof arktype.errors) && '$network' in evmNetworkAccountEvmNetworkEvmAccountSelector && '$actor' in evmNetworkAccountEvmNetworkEvmAccountSelector)
			routeCandidates.push({ entityType: EntityType.EvmNetworkAccount, selectorName: 'EvmNetworkEvmAccount', selector: evmNetworkAccountEvmNetworkEvmAccountSelector })
	}

	if (((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'SolanaRuntime')) && projectionNetwork.namespace === 'Solana') && matchSolanaPubkey(params.accountId)) {
		const solanaAccountNetworkPubkeySelector = parseEntitySelector(
			schema,
			SolanaAccountSchema,
			{
				$network: parentData.selector,
				pubkey: params.accountId,
			}
		)
		if (!(solanaAccountNetworkPubkeySelector instanceof arktype.errors) && '$network' in solanaAccountNetworkPubkeySelector && 'pubkey' in solanaAccountNetworkPubkeySelector)
			routeCandidates.push({ entityType: EntityType.SolanaAccount, selectorName: 'NetworkPubkey', selector: solanaAccountNetworkPubkeySelector })
	}

	if ((projectionNetwork.namespace === 'Ton' && projectionNetwork.namespace === 'Ton') && matchStringSegment(params.accountId)) {
		const tonAccountNetworkAddressSelector = parseEntitySelector(
			schema,
			TonAccountSchema,
			{
				$network: parentData.selector,
				address: params.accountId,
			}
		)
		if (!(tonAccountNetworkAddressSelector instanceof arktype.errors) && '$network' in tonAccountNetworkAddressSelector && 'address' in tonAccountNetworkAddressSelector)
			routeCandidates.push({ entityType: EntityType.TonAccount, selectorName: 'NetworkAddress', selector: tonAccountNetworkAddressSelector })
	}

	if ((projectionNetwork.namespace === 'Xrpl' && projectionNetwork.namespace === 'Xrpl') && matchStringSegment(params.accountId)) {
		const xrplAccountNetworkAccountSelector = parseEntitySelector(
			schema,
			XrplAccountSchema,
			{
				$network: parentData.selector,
				account: params.accountId,
			}
		)
		if (!(xrplAccountNetworkAccountSelector instanceof arktype.errors) && '$network' in xrplAccountNetworkAccountSelector && 'account' in xrplAccountNetworkAccountSelector)
			routeCandidates.push({ entityType: EntityType.XrplAccount, selectorName: 'NetworkAccount', selector: xrplAccountNetworkAccountSelector })
	}

	if (routeCandidates.length === 0) error(404, 'Route selector not applicable')
	if (routeCandidates.length > 1) error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
