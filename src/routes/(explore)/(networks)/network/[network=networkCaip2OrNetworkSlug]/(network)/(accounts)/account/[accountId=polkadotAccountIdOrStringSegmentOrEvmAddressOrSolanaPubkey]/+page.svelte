<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { entityDefinitionByType } from '$/schema/index.ts'
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
				data.selector.accountId || 'Polkadot account'
			:
			data.entityType === EntityType.CosmosAccount && data.selectorName === 'NetworkAddress' ?
				data.selector.address || 'Cosmos account'
			:
			data.entityType === EntityType.HederaAccount && data.selectorName === 'NetworkAccountId' ?
				data.selector.accountId || 'hedera account'
			:
			data.entityType === EntityType.CardanoAddress && data.selectorName === 'NetworkAddress' ?
				data.selector.address || 'Cardano address'
			:
			data.entityType === EntityType.EvmNetworkAccount && data.selectorName === 'EvmNetworkEvmAccount' ?
				'EVM network account'
			:
			data.entityType === EntityType.SolanaAccount && data.selectorName === 'NetworkPubkey' ?
				data.selector.pubkey || 'solana account'
			:
			data.entityType === EntityType.TonAccount && data.selectorName === 'NetworkAddress' ?
				'TON account'
			:
				data.selector.account || 'XRPL account'
		)
	)
	const entityViewByType = {
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
	<title>{pageTitle} • {entityDefinitionByType[data.entityType].labels.singular} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={pageSelection}
	/>
</Page>
