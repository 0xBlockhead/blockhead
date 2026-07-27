<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	const collectionRoot0Selection = $derived(select(EntityType._Global, {
		scope: '$$blockheadAccounts',
	}).$$blockheadAccounts.$account)
	const collection0Selection = $derived(collectionRoot0Selection.Evm.$account
		.$$transactions({
			sources: [
				Source.Blockscout_Rest,
			],
		}))
	const collection1Selection = $derived(collectionRoot0Selection.Aptos.$account
		.$$transactions({
			sources: [
				Source.AptosIndexer_Graphql,
				Source.AptosFullnode_Rest,
			],
		}))
	const collection2Selection = $derived(collectionRoot0Selection.Cardano.$account
		.$$transactions({
			sources: [
				Source.Blockfrost_Rest,
			],
		}))
	const collection3Selection = $derived(collectionRoot0Selection.Cosmos.$account
		.$$transactions({
			sources: [
				Source.CosmosSdk_Rest,
			],
		}))
	const collection4Selection = $derived(collectionRoot0Selection.Hedera.$account
		.$$transactions({
			sources: [
				Source.HederaMirrorNode_Rest,
			],
		}))
	const collection5Selection = $derived(collectionRoot0Selection.Tron.$account
		.$$transactions({
			sources: [
				Source.TronGrid_Rest,
				Source.TronScan_Rest,
			],
		}))
	const collection6Selection = $derived(collectionRoot0Selection.Utxo.$account
		.$$transactions({
			sources: [
				Source.MempoolSpace_Rest,
			],
		}))
	const collection7Selection = $derived(collectionRoot0Selection.Xrpl.$account
		.$$transactions({
			sources: [
				Source.Xrpl_Rippled,
			],
		}))


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import AptosTransactionsView from '$/views/AptosTransactionsView.svelte'
	import CardanoTransactionsView from '$/views/CardanoTransactionsView.svelte'
	import CosmosTransactionsView from '$/views/CosmosTransactionsView.svelte'
	import HederaTransactionsView from '$/views/HederaTransactionsView.svelte'
	import TronTransactionsView from '$/views/TronTransactionsView.svelte'
	import UtxoTransactionsView from '$/views/UtxoTransactionsView.svelte'
	import XrplTransactionsView from '$/views/XrplTransactionsView.svelte'
</script>


<svelte:head>
	<title>Transactions • Blockhead</title>
</svelte:head>


<Page>
	<ResourceBoundary resource={collection0Selection}>
		{#snippet children(entities)}
			{#if entities.values.length > 0}
				<EvmTransactionsView
					href={resolve('/~/accounts/transactions')}
					title='EVM transactions'
					selection={collection0Selection}
					id='account-evm-transaction'
					data-column-item="flexible"
					data-card
					data-scroll-container
				/>
			{/if}
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary resource={collection1Selection}>
		{#snippet children(entities)}
			{#if entities.values.length > 0}
				<AptosTransactionsView
					href={resolve('/~/accounts/transactions')}
					title='Aptos transactions'
					selection={collection1Selection}
					id='account-aptos-transaction'
					data-column-item="flexible"
					data-card
					data-scroll-container
				/>
			{/if}
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary resource={collection2Selection}>
		{#snippet children(entities)}
			{#if entities.values.length > 0}
				<CardanoTransactionsView
					href={resolve('/~/accounts/transactions')}
					title='Cardano transactions'
					selection={collection2Selection}
					id='account-cardano-transaction'
					data-column-item="flexible"
					data-card
					data-scroll-container
				/>
			{/if}
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary resource={collection3Selection}>
		{#snippet children(entities)}
			{#if entities.values.length > 0}
				<CosmosTransactionsView
					href={resolve('/~/accounts/transactions')}
					title='Cosmos transactions'
					selection={collection3Selection}
					id='account-cosmos-transaction'
					data-column-item="flexible"
					data-card
					data-scroll-container
				/>
			{/if}
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary resource={collection4Selection}>
		{#snippet children(entities)}
			{#if entities.values.length > 0}
				<HederaTransactionsView
					href={resolve('/~/accounts/transactions')}
					title='Hedera transactions'
					selection={collection4Selection}
					id='account-hedera-transaction'
					data-column-item="flexible"
					data-card
					data-scroll-container
				/>
			{/if}
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary resource={collection5Selection}>
		{#snippet children(entities)}
			{#if entities.values.length > 0}
				<TronTransactionsView
					href={resolve('/~/accounts/transactions')}
					title='Tron transactions'
					selection={collection5Selection}
					id='account-tron-transaction'
					data-column-item="flexible"
					data-card
					data-scroll-container
				/>
			{/if}
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary resource={collection6Selection}>
		{#snippet children(entities)}
			{#if entities.values.length > 0}
				<UtxoTransactionsView
					href={resolve('/~/accounts/transactions')}
					title='UTXO transactions'
					selection={collection6Selection}
					id='account-utxo-transaction'
					data-column-item="flexible"
					data-card
					data-scroll-container
				/>
			{/if}
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary resource={collection7Selection}>
		{#snippet children(entities)}
			{#if entities.values.length > 0}
				<XrplTransactionsView
					href={resolve('/~/accounts/transactions')}
					title='XRPL transactions'
					selection={collection7Selection}
					id='account-xrpl-transaction'
					data-column-item="flexible"
					data-card
					data-scroll-container
				/>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
