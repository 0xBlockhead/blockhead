<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(
		(
			data.entityType === EntityType.PolkadotAccount && data.selectorName === 'NetworkAccountId' ?
				select(EntityType.PolkadotAccount, data.selector, {
					sources: [
						Source.SubstrateSidecar_Rest,
					],
				})
			:
			data.entityType === EntityType.CosmosAccount && data.selectorName === 'NetworkAddress' ?
				select(EntityType.CosmosAccount, data.selector)
			:
			data.entityType === EntityType.HederaAccount && data.selectorName === 'NetworkAccountId' ?
				select(EntityType.HederaAccount, data.selector, {
					sources: [
						Source.HederaMirrorNode_Rest,
					],
				})
			:
			data.entityType === EntityType.CardanoAddress && data.selectorName === 'NetworkAddress' ?
				select(EntityType.CardanoAddress, data.selector, {
					sources: [
						Source.Blockfrost_Rest,
					],
					fields: {
						addressKind: true,
						$stakeCredential: true,
					},
				})
			:
			data.entityType === EntityType.EvmNetworkAccount && data.selectorName === 'EvmNetworkEvmAccount' ?
				select(EntityType.EvmNetworkAccount, data.selector)
			:
			data.entityType === EntityType.SolanaAccount && data.selectorName === 'NetworkPubkey' ?
				select(EntityType.SolanaAccount, data.selector, {
					sources: [
						Source.Solana_JsonRpc,
					],
				})
			:
			data.entityType === EntityType.TonAccount && data.selectorName === 'NetworkAddress' ?
				select(EntityType.TonAccount, data.selector, {
					fields: {
						workchain: true,
						addressHash: true,
					},
				})
			:
				select(EntityType.XrplAccount, data.selector, {
					sources: [
						Source.Xrpl_Rippled,
					],
				})
		)
	)
	const pageTitle = $derived(
		(
			data.entityType === EntityType.PolkadotAccount && data.selectorName === 'NetworkAccountId' ?
				(data.selector.accountId || 'Polkadot account')
			:
			data.entityType === EntityType.CosmosAccount && data.selectorName === 'NetworkAddress' ?
				(data.selector.address || 'Cosmos account')
			:
			data.entityType === EntityType.HederaAccount && data.selectorName === 'NetworkAccountId' ?
				(data.selector.accountId || 'hedera account')
			:
			data.entityType === EntityType.CardanoAddress && data.selectorName === 'NetworkAddress' ?
				(data.selector.address || 'Cardano address')
			:
			data.entityType === EntityType.EvmNetworkAccount && data.selectorName === 'EvmNetworkEvmAccount' ?
				('EVM network account')
			:
			data.entityType === EntityType.SolanaAccount && data.selectorName === 'NetworkPubkey' ?
				(data.selector.pubkey || 'solana account')
			:
			data.entityType === EntityType.TonAccount && data.selectorName === 'NetworkAddress' ?
				('TON account')
			:
				(data.selector.account || 'XRPL account')
		)
	)
	const entityViewByType = {
		[EntityType.PolkadotAccount]: {
			Component: PolkadotAccountView,
			label: 'Polkadot account',
		},
		[EntityType.CosmosAccount]: {
			Component: CosmosAccountView,
			label: 'Cosmos account',
		},
		[EntityType.HederaAccount]: {
			Component: HederaAccountView,
			label: 'hedera account',
		},
		[EntityType.CardanoAddress]: {
			Component: CardanoAddressView,
			label: 'Cardano address',
		},
		[EntityType.EvmNetworkAccount]: {
			Component: EvmNetworkAccountView,
			label: 'EVM network account',
		},
		[EntityType.SolanaAccount]: {
			Component: SolanaAccountView,
			label: 'solana account',
		},
		[EntityType.TonAccount]: {
			Component: TonAccountView,
			label: 'TON account',
		},
		[EntityType.XrplAccount]: {
			Component: XrplAccountView,
			label: 'XRPL account',
		},
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
	<title>{pageTitle} • {entityViewByType[data.entityType].label} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType].Component}

	<EntityView
		selection={pageSelection}
	/>
</Page>
