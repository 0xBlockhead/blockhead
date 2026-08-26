<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	const collectionHref = resolve('/~/accounts/transactions')
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
					href={collectionHref}
					selection={collection0Selection}
					id='account-evm-transaction'
				/>
			{/if}
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary resource={collection1Selection}>
		{#snippet children(entities)}
			{#if entities.values.length > 0}
				<AptosTransactionsView
					href={collectionHref}
					selection={collection1Selection}
					id='account-aptos-transaction'
				/>
			{/if}
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary resource={collection2Selection}>
		{#snippet children(entities)}
			{#if entities.values.length > 0}
				<CardanoTransactionsView
					href={collectionHref}
					selection={collection2Selection}
					id='account-cardano-transaction'
				/>
			{/if}
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary resource={collection3Selection}>
		{#snippet children(entities)}
			{#if entities.values.length > 0}
				<CosmosTransactionsView
					href={collectionHref}
					title='Cosmos transactions'
					selection={collection3Selection}
					id='account-cosmos-transaction'
				/>
			{/if}
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary resource={collection4Selection}>
		{#snippet children(entities)}
			{#if entities.values.length > 0}
				<HederaTransactionsView
					href={collectionHref}
					selection={collection4Selection}
					id='account-hedera-transaction'
				/>
			{/if}
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary resource={collection5Selection}>
		{#snippet children(entities)}
			{#if entities.values.length > 0}
				<TronTransactionsView
					href={collectionHref}
					selection={collection5Selection}
					id='account-tron-transaction'
				/>
			{/if}
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary resource={collection6Selection}>
		{#snippet children(entities)}
			{#if entities.values.length > 0}
				<UtxoTransactionsView
					href={collectionHref}
					selection={collection6Selection}
					id='account-utxo-transaction'
				/>
			{/if}
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary resource={collection7Selection}>
		{#snippet children(entities)}
			{#if entities.values.length > 0}
				<XrplTransactionsView
					href={collectionHref}
					selection={collection7Selection}
					id='account-xrpl-transaction'
				/>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
