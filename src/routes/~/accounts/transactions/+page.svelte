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
	})
		.$$blockheadAccounts({
			sources: [
				Source.Local_Internal,
			],
		})
		.$account({
			sources: [
				Source.Local_Internal,
			],
		}))


	// Components
	import Page from '$/components/Page.svelte'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
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
	<ProjectionBoundary
		resource={collectionRoot0Selection.Evm}
	>
		{#snippet Applicable(projection)}
			{@const collection0Selection = projection
				.$account({
					sources: [
						Source.Constants_Internal,
					],
				})
				.$$transactions({
					sources: [
						Source.Blockscout_Rest,
					],
				})}

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
		{/snippet}
	</ProjectionBoundary>

	<ProjectionBoundary
		resource={collectionRoot0Selection.Aptos}
	>
		{#snippet Applicable(projection)}
			{@const collection1Selection = projection
				.$account({
					sources: [
						Source.Constants_Internal,
					],
				})
				.$$transactions({
					sources: [
						Source.AptosIndexer_Graphql,
						Source.AptosFullnode_Rest,
					],
				})}

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
		{/snippet}
	</ProjectionBoundary>

	<ProjectionBoundary
		resource={collectionRoot0Selection.Cardano}
	>
		{#snippet Applicable(projection)}
			{@const collection2Selection = projection
				.$account({
					sources: [
						Source.Constants_Internal,
					],
				})
				.$$transactions({
					sources: [
						Source.Blockfrost_Rest,
					],
				})}

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
		{/snippet}
	</ProjectionBoundary>

	<ProjectionBoundary
		resource={collectionRoot0Selection.Cosmos}
	>
		{#snippet Applicable(projection)}
			{@const collection3Selection = projection
				.$account({
					sources: [
						Source.Constants_Internal,
					],
				})
				.$$transactions({
					sources: [
						Source.CosmosSdk_Rest,
					],
				})}

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
		{/snippet}
	</ProjectionBoundary>

	<ProjectionBoundary
		resource={collectionRoot0Selection.Hedera}
	>
		{#snippet Applicable(projection)}
			{@const collection4Selection = projection
				.$account({
					sources: [
						Source.Constants_Internal,
					],
				})
				.$$transactions({
					sources: [
						Source.HederaMirrorNode_Rest,
					],
				})}

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
		{/snippet}
	</ProjectionBoundary>

	<ProjectionBoundary
		resource={collectionRoot0Selection.Tron}
	>
		{#snippet Applicable(projection)}
			{@const collection5Selection = projection
				.$account({
					sources: [
						Source.Constants_Internal,
					],
				})
				.$$transactions({
					sources: [
						Source.TronGrid_Rest,
						Source.TronScan_Rest,
					],
				})}

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
		{/snippet}
	</ProjectionBoundary>

	<ProjectionBoundary
		resource={collectionRoot0Selection.Utxo}
	>
		{#snippet Applicable(projection)}
			{@const collection6Selection = projection
				.$account({
					sources: [
						Source.Constants_Internal,
					],
				})
				.$$transactions({
					sources: [
						Source.MempoolSpace_Rest,
					],
				})}

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
		{/snippet}
	</ProjectionBoundary>

	<ProjectionBoundary
		resource={collectionRoot0Selection.Xrpl}
	>
		{#snippet Applicable(projection)}
			{@const collection7Selection = projection
				.$account({
					sources: [
						Source.Constants_Internal,
					],
				})
				.$$transactions({
					sources: [
						Source.Xrpl_Rippled,
					],
				})}

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
		{/snippet}
	</ProjectionBoundary>
</Page>
