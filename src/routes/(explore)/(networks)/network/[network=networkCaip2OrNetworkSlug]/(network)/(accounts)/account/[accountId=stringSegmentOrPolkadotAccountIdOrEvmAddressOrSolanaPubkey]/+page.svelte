<!-- Generated from APP.ts. -->

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

	const entityViewByType = {
		[EntityType.AptosAccount]: AptosAccountView,
		[EntityType.PolkadotAccount]: PolkadotAccountView,
		[EntityType.CosmosAccount]: CosmosAccountView,
		[EntityType.HederaAccount]: HederaAccountView,
		[EntityType.CardanoAddress]: CardanoAddressView,
		[EntityType.EvmNetworkAccount]: EvmNetworkAccountView,
		[EntityType.SolanaAccount]: SolanaAccountView,
		[EntityType.StarknetContract]: StarknetContractView,
		[EntityType.TronAccount]: TronAccountView,
		[EntityType.TonAccount]: TonAccountView,
		[EntityType.XrplAccount]: XrplAccountView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import AptosAccountView from '$/views/AptosAccountView.svelte'
	import PolkadotAccountView from '$/views/PolkadotAccountView.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
	import CardanoAddressView from '$/views/CardanoAddressView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import StarknetContractView from '$/views/StarknetContractView.svelte'
	import TronAccountView from '$/views/TronAccountView.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
	import XrplAccountView from '$/views/XrplAccountView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.AptosAccount ?
				(data.selector.address || 'aptos account') + ' • aptos account • Blockhead'
			:
			data.entityType === EntityType.PolkadotAccount ?
				(data.selector.accountId || 'Polkadot account') + ' • Polkadot account • Blockhead'
			:
			data.entityType === EntityType.CosmosAccount ?
				(data.selector.address || 'Cosmos account') + ' • Cosmos account • Blockhead'
			:
			data.entityType === EntityType.HederaAccount ?
				(data.selector.accountId || 'hedera account') + ' • hedera account • Blockhead'
			:
			data.entityType === EntityType.CardanoAddress ?
				(data.selector.address || 'Cardano address') + ' • Cardano address • Blockhead'
			:
			data.entityType === EntityType.EvmNetworkAccount ?
				('EVM network account') + ' • EVM network account • Blockhead'
			:
			data.entityType === EntityType.SolanaAccount ?
				(data.selector.pubkey || 'solana account') + ' • solana account • Blockhead'
			:
			data.entityType === EntityType.StarknetContract ?
				(data.selector.address || 'starknet contract') + ' • starknet contract • Blockhead'
			:
			data.entityType === EntityType.TronAccount ?
				(data.selector.address || 'tron account') + ' • tron account • Blockhead'
			:
			data.entityType === EntityType.TonAccount ?
				('TON account') + ' • TON account • Blockhead'
			:
				(data.selector.account || 'XRPL account') + ' • XRPL account • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={
			data.entityType === EntityType.AptosAccount ?
				select(EntityType.AptosAccount, data.selector)
			:
			data.entityType === EntityType.PolkadotAccount ?
				select(EntityType.PolkadotAccount, data.selector, {
					sources: [
						Source.SubstrateSidecar_Rest,
					],
				})
			:
			data.entityType === EntityType.CosmosAccount ?
				select(EntityType.CosmosAccount, data.selector)
			:
			data.entityType === EntityType.HederaAccount ?
				select(EntityType.HederaAccount, data.selector, {
					sources: [
						Source.HederaMirrorNode_Rest,
					],
				})
			:
			data.entityType === EntityType.CardanoAddress ?
				select(EntityType.CardanoAddress, data.selector, {
					sources: [
						Source.Blockfrost_Rest,
					],
				})
			:
			data.entityType === EntityType.EvmNetworkAccount ?
				select(EntityType.EvmNetworkAccount, data.selector)
			:
			data.entityType === EntityType.SolanaAccount ?
				select(EntityType.SolanaAccount, data.selector, {
					sources: [
						Source.Solana_JsonRpc,
					],
				})
			:
			data.entityType === EntityType.StarknetContract ?
				select(EntityType.StarknetContract, data.selector, {
					sources: [
						Source.Juno_JsonRpc,
						Source.Pathfinder,
						Source.Starkscan,
						Source.Voyager,
					],
				})
			:
			data.entityType === EntityType.TronAccount ?
				select(EntityType.TronAccount, data.selector)
			:
			data.entityType === EntityType.TonAccount ?
				select(EntityType.TonAccount, data.selector)
			:
				select(EntityType.XrplAccount, data.selector, {
					sources: [
						Source.Xrpl_Rippled,
					],
				})
		}
	/>
</Page>
