<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const entityViewByType = {
		[EntityType.BittensorNetwork_Timestamp]: BittensorNetwork_TimestampView,
		[EntityType.CardanoNetwork_Timestamp]: CardanoNetwork_TimestampView,
		[EntityType.FilecoinNetwork_Timestamp]: FilecoinNetwork_TimestampView,
		[EntityType.HederaNetwork_Timestamp]: HederaNetwork_TimestampView,
		[EntityType.MoneroNetwork_Timestamp]: MoneroNetwork_TimestampView,
		[EntityType.TonNetwork_Timestamp]: TonNetwork_TimestampView,
		[EntityType.TronNetwork_Timestamp]: TronNetwork_TimestampView,
		[EntityType.AvailNetwork_Timestamp]: AvailNetwork_TimestampView,
		[EntityType.CelestiaNetwork_Timestamp]: CelestiaNetwork_TimestampView,
		[EntityType.DydxChainNetwork_Timestamp]: DydxChainNetwork_TimestampView,
		[EntityType.LightningNetwork_Timestamp]: LightningNetwork_TimestampView,
		[EntityType.StarknetNetwork_Timestamp]: StarknetNetwork_TimestampView,
		[EntityType.HyperliquidNetwork_Timestamp]: HyperliquidNetwork_TimestampView,
		[EntityType.IcpNetwork_Timestamp]: IcpNetwork_TimestampView,
		[EntityType.KaspaNetwork_Timestamp]: KaspaNetwork_TimestampView,
		[EntityType.LogosBlockchainNetwork_Timestamp]: LogosBlockchainNetwork_TimestampView,
		[EntityType.StellarNetwork_Timestamp]: StellarNetwork_TimestampView,
		[EntityType.SuiNetwork_Timestamp]: SuiNetwork_TimestampView,
		[EntityType.TezosNetwork_Timestamp]: TezosNetwork_TimestampView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import BittensorNetwork_TimestampView from '$/views/BittensorNetwork_TimestampView.svelte'
	import CardanoNetwork_TimestampView from '$/views/CardanoNetwork_TimestampView.svelte'
	import FilecoinNetwork_TimestampView from '$/views/FilecoinNetwork_TimestampView.svelte'
	import HederaNetwork_TimestampView from '$/views/HederaNetwork_TimestampView.svelte'
	import MoneroNetwork_TimestampView from '$/views/MoneroNetwork_TimestampView.svelte'
	import TonNetwork_TimestampView from '$/views/TonNetwork_TimestampView.svelte'
	import TronNetwork_TimestampView from '$/views/TronNetwork_TimestampView.svelte'
	import AvailNetwork_TimestampView from '$/views/AvailNetwork_TimestampView.svelte'
	import CelestiaNetwork_TimestampView from '$/views/CelestiaNetwork_TimestampView.svelte'
	import DydxChainNetwork_TimestampView from '$/views/DydxChainNetwork_TimestampView.svelte'
	import LightningNetwork_TimestampView from '$/views/LightningNetwork_TimestampView.svelte'
	import StarknetNetwork_TimestampView from '$/views/StarknetNetwork_TimestampView.svelte'
	import HyperliquidNetwork_TimestampView from '$/views/HyperliquidNetwork_TimestampView.svelte'
	import IcpNetwork_TimestampView from '$/views/IcpNetwork_TimestampView.svelte'
	import KaspaNetwork_TimestampView from '$/views/KaspaNetwork_TimestampView.svelte'
	import LogosBlockchainNetwork_TimestampView from '$/views/LogosBlockchainNetwork_TimestampView.svelte'
	import StellarNetwork_TimestampView from '$/views/StellarNetwork_TimestampView.svelte'
	import SuiNetwork_TimestampView from '$/views/SuiNetwork_TimestampView.svelte'
	import TezosNetwork_TimestampView from '$/views/TezosNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.BittensorNetwork_Timestamp ?
				(String(data.selector.timestampMs) || 'Bittensor network observation') + ' • Bittensor network observation • Blockhead'
			:
			data.entityType === EntityType.CardanoNetwork_Timestamp ?
				('Cardano network timestamp') + ' • Cardano network timestamp • Blockhead'
			:
			data.entityType === EntityType.FilecoinNetwork_Timestamp ?
				(String(data.selector.timestampMs) || 'filecoin network timestamp') + ' • filecoin network timestamp • Blockhead'
			:
			data.entityType === EntityType.HederaNetwork_Timestamp ?
				('hedera network timestamp') + ' • hedera network timestamp • Blockhead'
			:
			data.entityType === EntityType.MoneroNetwork_Timestamp ?
				(String(data.selector.timestampMs) || 'monero network timestamp') + ' • monero network timestamp • Blockhead'
			:
			data.entityType === EntityType.TonNetwork_Timestamp ?
				('TON network timestamp') + ' • TON network timestamp • Blockhead'
			:
			data.entityType === EntityType.TronNetwork_Timestamp ?
				('tron network timestamp') + ' • tron network timestamp • Blockhead'
			:
			data.entityType === EntityType.AvailNetwork_Timestamp ?
				(String(data.selector.timestampMs) || 'avail network timestamp') + ' • avail network timestamp • Blockhead'
			:
			data.entityType === EntityType.CelestiaNetwork_Timestamp ?
				(String(data.selector.timestampMs) || 'celestia network timestamp') + ' • celestia network timestamp • Blockhead'
			:
			data.entityType === EntityType.DydxChainNetwork_Timestamp ?
				(String(data.selector.timestampMs) || 'dydx chain network timestamp') + ' • dydx chain network timestamp • Blockhead'
			:
			data.entityType === EntityType.LightningNetwork_Timestamp ?
				(String(data.selector.timestampMs) || 'Lightning public network observation') + ' • Lightning public network observation • Blockhead'
			:
			data.entityType === EntityType.StarknetNetwork_Timestamp ?
				('starknet network timestamp') + ' • starknet network timestamp • Blockhead'
			:
			data.entityType === EntityType.HyperliquidNetwork_Timestamp ?
				(String(data.selector.timestampMs) || 'hyperliquid network timestamp') + ' • hyperliquid network timestamp • Blockhead'
			:
			data.entityType === EntityType.IcpNetwork_Timestamp ?
				('ICP network timestamp') + ' • ICP network timestamp • Blockhead'
			:
			data.entityType === EntityType.KaspaNetwork_Timestamp ?
				('kaspa network timestamp') + ' • kaspa network timestamp • Blockhead'
			:
			data.entityType === EntityType.LogosBlockchainNetwork_Timestamp ?
				(String(data.selector.timestampMs) || 'Logos blockchain network timestamp') + ' • Logos blockchain network timestamp • Blockhead'
			:
			data.entityType === EntityType.StellarNetwork_Timestamp ?
				('stellar network timestamp') + ' • stellar network timestamp • Blockhead'
			:
			data.entityType === EntityType.SuiNetwork_Timestamp ?
				('Sui network timestamp') + ' • Sui network timestamp • Blockhead'
			:
				('tezos network timestamp') + ' • tezos network timestamp • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={
			data.entityType === EntityType.BittensorNetwork_Timestamp ?
				select(EntityType.BittensorNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.CardanoNetwork_Timestamp ?
				select(EntityType.CardanoNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.FilecoinNetwork_Timestamp ?
				select(EntityType.FilecoinNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.HederaNetwork_Timestamp ?
				select(EntityType.HederaNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.MoneroNetwork_Timestamp ?
				select(EntityType.MoneroNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.TonNetwork_Timestamp ?
				select(EntityType.TonNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.TronNetwork_Timestamp ?
				select(EntityType.TronNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.AvailNetwork_Timestamp ?
				select(EntityType.AvailNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.CelestiaNetwork_Timestamp ?
				select(EntityType.CelestiaNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.DydxChainNetwork_Timestamp ?
				select(EntityType.DydxChainNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.LightningNetwork_Timestamp ?
				select(EntityType.LightningNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.StarknetNetwork_Timestamp ?
				select(EntityType.StarknetNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.HyperliquidNetwork_Timestamp ?
				select(EntityType.HyperliquidNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.IcpNetwork_Timestamp ?
				select(EntityType.IcpNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.KaspaNetwork_Timestamp ?
				select(EntityType.KaspaNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.LogosBlockchainNetwork_Timestamp ?
				select(EntityType.LogosBlockchainNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.StellarNetwork_Timestamp ?
				select(EntityType.StellarNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.SuiNetwork_Timestamp ?
				select(EntityType.SuiNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
				select(EntityType.TezosNetwork_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
		}
	/>
</Page>
