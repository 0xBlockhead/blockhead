<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data.entityType === EntityType.PolkadotAccount && data.selectorName === 'NetworkAccountId' ? select(EntityType.PolkadotAccount, data.selector, {
		sources: [
			Source.SubstrateSidecar_Rest,
		],
	}) : data.entityType === EntityType.CosmosAccount && data.selectorName === 'NetworkAddress' ? select(EntityType.CosmosAccount, data.selector) : data.entityType === EntityType.HederaAccount && data.selectorName === 'NetworkAccountId' ? select(EntityType.HederaAccount, data.selector, {
		sources: [
			Source.HederaMirrorNode_Rest,
		],
	}) : data.entityType === EntityType.CardanoAddress && data.selectorName === 'NetworkAddress' ? select(EntityType.CardanoAddress, data.selector, {
		sources: [
			Source.Blockfrost_Rest,
		],
		fields: {
			addressKind: true,
			$stakeCredential: true,
		},
	}) : data.entityType === EntityType.EvmNetworkAccount && data.selectorName === 'EvmNetworkEvmAccount' ? select(EntityType.EvmNetworkAccount, data.selector) : data.entityType === EntityType.SolanaAccount && data.selectorName === 'NetworkPubkey' ? select(EntityType.SolanaAccount, data.selector, {
		sources: [
			Source.Solana_JsonRpc,
		],
	}) : data.entityType === EntityType.TonAccount && data.selectorName === 'NetworkAddress' ? select(EntityType.TonAccount, data.selector, {
		fields: {
			workchain: true,
			addressHash: true,
		},
	}) : select(EntityType.XrplAccount, data.selector, {
		sources: [
			Source.Xrpl_Rippled,
		],
	}))
	const entityViewComponentByType = {
		[EntityType.PolkadotAccount]: PolkadotAccountView,
		[EntityType.CosmosAccount]: CosmosAccountView,
		[EntityType.HederaAccount]: HederaAccountView,
		[EntityType.CardanoAddress]: CardanoAddressView,
		[EntityType.EvmNetworkAccount]: EvmNetworkAccountView,
		[EntityType.SolanaAccount]: SolanaAccountView,
		[EntityType.TonAccount]: TonAccountView,
		[EntityType.XrplAccount]: XrplAccountView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotAccountView from '$/views/PolkadotAccountView.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
	import CardanoAddressView from '$/views/CardanoAddressView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
	import XrplAccountView from '$/views/XrplAccountView.svelte'
</script>


<svelte:head>
	<title>{data.entityType === EntityType.PolkadotAccount && data.selectorName === 'NetworkAccountId' ? (pageSelection.entity == null ? [String((data.selector.accountId) ?? '')].filter(Boolean).join(' ') || 'Polkadot account' : [String((({ ...data.selector, ...pageSelection.entity }).accountId) ?? '')].filter(Boolean).join(' ') || 'Polkadot account') : data.entityType === EntityType.CosmosAccount && data.selectorName === 'NetworkAddress' ? (pageSelection.entity == null ? [String((data.selector.address) ?? '')].filter(Boolean).join(' ') || 'Cosmos account' : [String((({ ...data.selector, ...pageSelection.entity }).address) ?? '')].filter(Boolean).join(' ') || 'Cosmos account') : data.entityType === EntityType.HederaAccount && data.selectorName === 'NetworkAccountId' ? (pageSelection.entity == null ? [String((data.selector.accountId) ?? '')].filter(Boolean).join(' ') || 'hedera account' : [String((({ ...data.selector, ...pageSelection.entity }).accountId) ?? '')].filter(Boolean).join(' ') || 'hedera account') : data.entityType === EntityType.CardanoAddress && data.selectorName === 'NetworkAddress' ? (pageSelection.entity == null ? [String((data.selector.address) ?? '')].filter(Boolean).join(' ') || 'Cardano address' : [String((({ ...data.selector, ...pageSelection.entity }).address) ?? '')].filter(Boolean).join(' ') || 'Cardano address') : data.entityType === EntityType.EvmNetworkAccount && data.selectorName === 'EvmNetworkEvmAccount' ? (pageSelection.entity == null ? 'EVM network account' : 'EVM network account') : data.entityType === EntityType.SolanaAccount && data.selectorName === 'NetworkPubkey' ? (pageSelection.entity == null ? [String((data.selector.pubkey) ?? '')].filter(Boolean).join(' ') || 'solana account' : [String((({ ...data.selector, ...pageSelection.entity }).pubkey) ?? '')].filter(Boolean).join(' ') || 'solana account') : data.entityType === EntityType.TonAccount && data.selectorName === 'NetworkAddress' ? (pageSelection.entity == null ? 'TON account' : 'TON account') : (pageSelection.entity == null ? [String((data.selector.account) ?? '')].filter(Boolean).join(' ') || 'XRPL account' : [String((({ ...data.selector, ...pageSelection.entity }).account) ?? '')].filter(Boolean).join(' ') || 'XRPL account')} • {data.entityType === EntityType.PolkadotAccount && data.selectorName === 'NetworkAccountId' ? 'Polkadot account' : data.entityType === EntityType.CosmosAccount && data.selectorName === 'NetworkAddress' ? 'Cosmos account' : data.entityType === EntityType.HederaAccount && data.selectorName === 'NetworkAccountId' ? 'hedera account' : data.entityType === EntityType.CardanoAddress && data.selectorName === 'NetworkAddress' ? 'Cardano address' : data.entityType === EntityType.EvmNetworkAccount && data.selectorName === 'EvmNetworkEvmAccount' ? 'EVM network account' : data.entityType === EntityType.SolanaAccount && data.selectorName === 'NetworkPubkey' ? 'solana account' : data.entityType === EntityType.TonAccount && data.selectorName === 'NetworkAddress' ? 'TON account' : 'XRPL account'} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewComponentByType[data.entityType]}

	<EntityView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
				network: params.network,
				accountId: params.accountId,
			})
		}
		selection={pageSelection}
	/>
</Page>
