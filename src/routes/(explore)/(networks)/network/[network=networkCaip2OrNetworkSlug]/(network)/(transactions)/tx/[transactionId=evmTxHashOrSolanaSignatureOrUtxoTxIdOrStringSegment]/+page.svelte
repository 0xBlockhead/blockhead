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
			data.entityType === EntityType.EvmTransaction ?
				select(EntityType.EvmTransaction, data.selector, {
					sources: [
						Source.Blockscout_Rest,
						Source.Voltaire_JsonRpc,
					],
				})
			:
			data.entityType === EntityType.SolanaTransaction ?
				select(EntityType.SolanaTransaction, data.selector)
			:
			data.entityType === EntityType.CardanoTransaction ?
				select(EntityType.CardanoTransaction, data.selector, {
					sources: [
						Source.Blockfrost_Rest,
						Source.CardanoKoios_Rest,
					],
				})
			:
			data.entityType === EntityType.UtxoTransaction ?
				select(EntityType.UtxoTransaction, data.selector)
			:
			data.entityType === EntityType.ArweaveTransaction ?
				select(EntityType.ArweaveTransaction, data.selector)
			:
			data.entityType === EntityType.CosmosTransaction ?
				select(EntityType.CosmosTransaction, data.selector)
			:
			data.entityType === EntityType.HyperliquidTransaction ?
				select(EntityType.HyperliquidTransaction, data.selector)
			:
			data.entityType === EntityType.MoneroTransaction ?
				select(EntityType.MoneroTransaction, data.selector, {
					sources: [
						Source.MoneroDaemonRpc_JsonRpc,
					],
				})
			:
			data.entityType === EntityType.NearTransaction ?
				select(EntityType.NearTransaction, data.selector, {
					sources: [
						Source.NearRpc_JsonRpc,
						Source.NearBlocks_Rest,
					],
				})
			:
			data.entityType === EntityType.TronTransaction ?
				select(EntityType.TronTransaction, data.selector)
			:
				select(EntityType.AptosTransaction, data.selector, {
					fields: {
						version: true,
					},
				})
		)
	)
	const entityViewByType = {
		[EntityType.EvmTransaction]: EvmTransactionView,
		[EntityType.SolanaTransaction]: SolanaTransactionView,
		[EntityType.CardanoTransaction]: CardanoTransactionView,
		[EntityType.UtxoTransaction]: UtxoTransactionView,
		[EntityType.ArweaveTransaction]: ArweaveTransactionView,
		[EntityType.CosmosTransaction]: CosmosTransactionView,
		[EntityType.HyperliquidTransaction]: HyperliquidTransactionView,
		[EntityType.MoneroTransaction]: MoneroTransactionView,
		[EntityType.NearTransaction]: NearTransactionView,
		[EntityType.TronTransaction]: TronTransactionView,
		[EntityType.AptosTransaction]: AptosTransactionView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
	import CardanoTransactionView from '$/views/CardanoTransactionView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
	import ArweaveTransactionView from '$/views/ArweaveTransactionView.svelte'
	import CosmosTransactionView from '$/views/CosmosTransactionView.svelte'
	import HyperliquidTransactionView from '$/views/HyperliquidTransactionView.svelte'
	import MoneroTransactionView from '$/views/MoneroTransactionView.svelte'
	import NearTransactionView from '$/views/NearTransactionView.svelte'
	import TronTransactionView from '$/views/TronTransactionView.svelte'
	import AptosTransactionView from '$/views/AptosTransactionView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.EvmTransaction ?
				(data.selector.txHash || 'EVM transaction') + ' • EVM transaction • Blockhead'
			:
			data.entityType === EntityType.SolanaTransaction ?
				(data.selector.signature || 'solana transaction') + ' • solana transaction • Blockhead'
			:
			data.entityType === EntityType.CardanoTransaction ?
				(data.selector.hash || 'Cardano transaction') + ' • Cardano transaction • Blockhead'
			:
			data.entityType === EntityType.UtxoTransaction ?
				(data.selector.txId || 'UTXO transaction') + ' • UTXO transaction • Blockhead'
			:
			data.entityType === EntityType.ArweaveTransaction ?
				(data.selector.transactionId || 'arweave transaction') + ' • arweave transaction • Blockhead'
			:
			data.entityType === EntityType.CosmosTransaction ?
				(data.selector.txHash || 'Cosmos transaction') + ' • Cosmos transaction • Blockhead'
			:
			data.entityType === EntityType.HyperliquidTransaction ?
				('hyperliquid transaction') + ' • hyperliquid transaction • Blockhead'
			:
			data.entityType === EntityType.MoneroTransaction ?
				(data.selector.txHash || 'monero transaction') + ' • monero transaction • Blockhead'
			:
			data.entityType === EntityType.NearTransaction ?
				(data.selector.hash || 'near transaction') + ' • near transaction • Blockhead'
			:
			data.entityType === EntityType.TronTransaction ?
				(data.selector.transactionId || 'tron transaction') + ' • tron transaction • Blockhead'
			:
				(pageSelection.entity == null ? (data.selector.hash ?? '') || 'aptos transaction' : data.selector.hash || String(pageSelection.entity.version) || 'aptos transaction') + ' • aptos transaction • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={pageSelection}
	/>
</Page>
