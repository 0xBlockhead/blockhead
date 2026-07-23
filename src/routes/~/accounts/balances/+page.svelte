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
	import EvmNetworkActorCoinBalancesView from '$/views/EvmNetworkActorCoinBalancesView.svelte'
	import AptosCoinBalance_TimestampsView from '$/views/AptosCoinBalance_TimestampsView.svelte'
	import CardanoAddress_TimestampsView from '$/views/CardanoAddress_TimestampsView.svelte'
	import HederaAccount_TimestampsView from '$/views/HederaAccount_TimestampsView.svelte'
	import PolkadotAccount_TimestampsView from '$/views/PolkadotAccount_TimestampsView.svelte'
	import SolanaAccount_TimestampsView from '$/views/SolanaAccount_TimestampsView.svelte'
	import TronAccount_TimestampsView from '$/views/TronAccount_TimestampsView.svelte'
	import TronAccountTokenBalance_TimestampsView from '$/views/TronAccountTokenBalance_TimestampsView.svelte'
	import TonAccount_TimestampsView from '$/views/TonAccount_TimestampsView.svelte'
	import UtxoAddress_TimestampsView from '$/views/UtxoAddress_TimestampsView.svelte'
	import XrplAccount_TimestampsView from '$/views/XrplAccount_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Balances • Blockhead</title>
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
				.$$ownedCoins({
					sources: [
						Source.Allium_Rest,
					],
				})}

			<ResourceBoundary resource={collection0Selection}>
				{#snippet children(entities)}
					{#if entities.values.length > 0}
						<EvmNetworkActorCoinBalancesView
							href={resolve('/~/accounts/balances')}
							title='EVM balances'
							selection={collection0Selection}
							id='account-evm-network-actor-coin-balance'
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
				.$$balances({
					sources: [
						Source.AptosIndexer_Graphql,
					],
				})}

			<ResourceBoundary resource={collection1Selection}>
				{#snippet children(entities)}
					{#if entities.values.length > 0}
						<AptosCoinBalance_TimestampsView
							href={resolve('/~/accounts/balances')}
							title='Aptos balances'
							selection={collection1Selection}
							id='account-aptos-coin-balance-timestamp'
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
				.$$timestamps({
					sources: [
						Source.Blockfrost_Rest,
					],
				})}

			<ResourceBoundary resource={collection2Selection}>
				{#snippet children(entities)}
					{#if entities.values.length > 0}
						<CardanoAddress_TimestampsView
							href={resolve('/~/accounts/balances')}
							title='Cardano balances'
							selection={collection2Selection}
							id='account-cardano-address-timestamp'
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
			{@const collection3Selection = projection
				.$account({
					sources: [
						Source.Constants_Internal,
					],
				})
				.$$timestamps({
					sources: [
						Source.HederaMirrorNode_Rest,
					],
				})}

			<ResourceBoundary resource={collection3Selection}>
				{#snippet children(entities)}
					{#if entities.values.length > 0}
						<HederaAccount_TimestampsView
							href={resolve('/~/accounts/balances')}
							title='Hedera balances'
							selection={collection3Selection}
							id='account-hedera-account-timestamp'
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
		resource={collectionRoot0Selection.Polkadot}
	>
		{#snippet Applicable(projection)}
			{@const collection4Selection = projection
				.$account({
					sources: [
						Source.Constants_Internal,
					],
				})
				.$$timestamps({
					sources: [
						Source.SubstrateSidecar_Rest,
					],
				})}

			<ResourceBoundary resource={collection4Selection}>
				{#snippet children(entities)}
					{#if entities.values.length > 0}
						<PolkadotAccount_TimestampsView
							href={resolve('/~/accounts/balances')}
							title='Polkadot balances'
							selection={collection4Selection}
							id='account-polkadot-account-timestamp'
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
		resource={collectionRoot0Selection.Solana}
	>
		{#snippet Applicable(projection)}
			{@const collection5Selection = projection
				.$account({
					sources: [
						Source.Constants_Internal,
					],
				})
				.$$timestamps({
					sources: [
						Source.Solana_JsonRpc,
					],
				})}

			<ResourceBoundary resource={collection5Selection}>
				{#snippet children(entities)}
					{#if entities.values.length > 0}
						<SolanaAccount_TimestampsView
							href={resolve('/~/accounts/balances')}
							title='Solana balances'
							selection={collection5Selection}
							id='account-solana-account-timestamp'
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
			{@const collection6Selection = projection
				.$account({
					sources: [
						Source.Constants_Internal,
					],
				})
				.$$timestamps({
					sources: [
						Source.TronGrid_Rest,
					],
				})}

			<ResourceBoundary resource={collection6Selection}>
				{#snippet children(entities)}
					{#if entities.values.length > 0}
						<TronAccount_TimestampsView
							href={resolve('/~/accounts/balances')}
							title='Tron balances'
							selection={collection6Selection}
							id='account-tron-account-timestamp'
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
			{@const collection7Selection = projection
				.$account({
					sources: [
						Source.Constants_Internal,
					],
				})
				.$$tokenBalanceTimestamps({
					sources: [
						Source.TronScan_Rest,
					],
				})}

			<ResourceBoundary resource={collection7Selection}>
				{#snippet children(entities)}
					{#if entities.values.length > 0}
						<TronAccountTokenBalance_TimestampsView
							href={resolve('/~/accounts/balances')}
							title='Tron token balances'
							selection={collection7Selection}
							id='account-tron-account-token-balance-timestamp'
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
		resource={collectionRoot0Selection.Ton}
	>
		{#snippet Applicable(projection)}
			{@const collection8Selection = projection
				.$account({
					sources: [
						Source.Constants_Internal,
					],
				})
				.$$timestamps({
					sources: [
						Source.TonApi_Rest,
					],
				})}

			<ResourceBoundary resource={collection8Selection}>
				{#snippet children(entities)}
					{#if entities.values.length > 0}
						<TonAccount_TimestampsView
							href={resolve('/~/accounts/balances')}
							title='TON balances'
							selection={collection8Selection}
							id='account-ton-account-timestamp'
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
			{@const collection9Selection = projection
				.$account({
					sources: [
						Source.Constants_Internal,
					],
				})
				.$$timestamps({
					sources: [
						Source.Blockchair_Rest,
						Source.MempoolSpace_Rest,
					],
				})}

			<ResourceBoundary resource={collection9Selection}>
				{#snippet children(entities)}
					{#if entities.values.length > 0}
						<UtxoAddress_TimestampsView
							href={resolve('/~/accounts/balances')}
							title='UTXO balances'
							selection={collection9Selection}
							id='account-utxo-address-timestamp'
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
			{@const collection10Selection = projection
				.$account({
					sources: [
						Source.Constants_Internal,
					],
				})
				.$$timestamps({
					sources: [
						Source.Xrpl_Rippled,
					],
				})}

			<ResourceBoundary resource={collection10Selection}>
				{#snippet children(entities)}
					{#if entities.values.length > 0}
						<XrplAccount_TimestampsView
							href={resolve('/~/accounts/balances')}
							title='XRPL balances'
							selection={collection10Selection}
							id='account-xrpl-account-timestamp'
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
