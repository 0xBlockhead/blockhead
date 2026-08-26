<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(
		(
			data.entityType === EntityType.EvmBlock ?
				select(EntityType.EvmBlock, data.selector, {
					sources: [
						Source.SqdPortal_RawHttp,
						Source.Voltaire_JsonRpc,
						Source.Blobscan_Rest,
						Source.Blockscout_Rest,
					],
					fields: {
						hash: true,
					},
				})
			:
			data.entityType === EntityType.SolanaBlock ?
				select(EntityType.SolanaBlock, data.selector)
			:
			data.entityType === EntityType.UtxoBlock ?
				select(EntityType.UtxoBlock, data.selector, {
					fields: {
						hash: true,
					},
				})
			:
			data.entityType === EntityType.PolkadotBlock ?
				select(EntityType.PolkadotBlock, data.selector, {
					fields: {
						hash: true,
					},
				})
			:
			data.entityType === EntityType.ArweaveBlock ?
				select(EntityType.ArweaveBlock, data.selector, {
					fields: {
						indepHash: true,
					},
				})
			:
			data.entityType === EntityType.CosmosBlock ?
				select(EntityType.CosmosBlock, data.selector, {
					fields: {
						hash: true,
					},
				})
			:
			data.entityType === EntityType.HederaBlock ?
				select(EntityType.HederaBlock, data.selector)
			:
			data.entityType === EntityType.HyperliquidBlock ?
				select(EntityType.HyperliquidBlock, data.selector)
			:
			data.entityType === EntityType.MoneroBlock ?
				select(EntityType.MoneroBlock, data.selector, {
					sources: [
						Source.MoneroDaemonRpc_JsonRpc,
						Source.ThreeXpl_Rest,
					],
				})
			:
			data.entityType === EntityType.NearBlock ?
				select(EntityType.NearBlock, data.selector, {
					sources: [
						Source.NearBlocks_Rest,
						Source.NearRpc_JsonRpc,
					],
				})
			:
				select(EntityType.TronBlock, data.selector, {
					sources: [
						Source.TronGrid_Rest,
						Source.TronFullNode_Rest,
						Source.TronSolidityNode_Rest,
						Source.TronScan_Rest,
					],
				})
		)
	)
	const entityViewByType = {
		[EntityType.EvmBlock]: EvmBlockView,
		[EntityType.SolanaBlock]: SolanaBlockView,
		[EntityType.UtxoBlock]: UtxoBlockView,
		[EntityType.PolkadotBlock]: PolkadotBlockView,
		[EntityType.ArweaveBlock]: ArweaveBlockView,
		[EntityType.CosmosBlock]: CosmosBlockView,
		[EntityType.HederaBlock]: HederaBlockView,
		[EntityType.HyperliquidBlock]: HyperliquidBlockView,
		[EntityType.MoneroBlock]: MoneroBlockView,
		[EntityType.NearBlock]: NearBlockView,
		[EntityType.TronBlock]: TronBlockView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
	import ArweaveBlockView from '$/views/ArweaveBlockView.svelte'
	import CosmosBlockView from '$/views/CosmosBlockView.svelte'
	import HederaBlockView from '$/views/HederaBlockView.svelte'
	import HyperliquidBlockView from '$/views/HyperliquidBlockView.svelte'
	import MoneroBlockView from '$/views/MoneroBlockView.svelte'
	import NearBlockView from '$/views/NearBlockView.svelte'
	import TronBlockView from '$/views/TronBlockView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.EvmBlock ?
				(pageSelection.entity == null ? `Block #${data.selector.blockNumber}` : (String(data.selector.blockNumber ?? '') ? 'Block #' + String(data.selector.blockNumber ?? '') : '') || (pageSelection.entity.hash ?? '') || 'EVM block') + ' • EVM block • Blockhead'
			:
			data.entityType === EntityType.SolanaBlock ?
				((String(data.selector.slot ?? '') ? 'Slot #' + String(data.selector.slot ?? '') : '') || 'solana block') + ' • solana block • Blockhead'
			:
			data.entityType === EntityType.UtxoBlock ?
				(pageSelection.entity == null ? `Block #${data.selector.height}` : (String(data.selector.height ?? '') ? 'Block #' + String(data.selector.height ?? '') : '') || (pageSelection.entity.hash ?? '') || 'UTXO block') + ' • UTXO block • Blockhead'
			:
			data.entityType === EntityType.PolkadotBlock ?
				(pageSelection.entity == null ? `Block #${data.selector.blockNumber}` : (String(data.selector.blockNumber ?? '') ? 'Block #' + String(data.selector.blockNumber ?? '') : '') || (pageSelection.entity.hash ?? '') || 'Polkadot block') + ' • Polkadot block • Blockhead'
			:
			data.entityType === EntityType.ArweaveBlock ?
				(pageSelection.entity == null ? String(data.selector.height ?? '') || 'arweave block' : String(data.selector.height) || pageSelection.entity.indepHash || 'arweave block') + ' • arweave block • Blockhead'
			:
			data.entityType === EntityType.CosmosBlock ?
				(pageSelection.entity == null ? `Block #${data.selector.height}` : (String(data.selector.height ?? '') ? 'Block #' + String(data.selector.height ?? '') : '') || (pageSelection.entity.hash ?? '') || 'Cosmos block') + ' • Cosmos block • Blockhead'
			:
			data.entityType === EntityType.HederaBlock ?
				('hedera block') + ' • hedera block • Blockhead'
			:
			data.entityType === EntityType.HyperliquidBlock ?
				('hyperliquid block') + ' • hyperliquid block • Blockhead'
			:
			data.entityType === EntityType.MoneroBlock ?
				(String(data.selector.height) || 'monero block') + ' • monero block • Blockhead'
			:
			data.entityType === EntityType.NearBlock ?
				(String(data.selector.height) || 'near block') + ' • near block • Blockhead'
			:
				(String(data.selector.height) || 'tron block') + ' • tron block • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={pageSelection}
	/>
</Page>
