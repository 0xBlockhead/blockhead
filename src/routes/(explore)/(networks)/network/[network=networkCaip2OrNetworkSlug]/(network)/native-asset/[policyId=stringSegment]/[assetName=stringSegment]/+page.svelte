<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoNativeAssetView from '$/views/CardanoNativeAssetView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoNativeAsset, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.assetName || pageSelection.entitySelector.policyId || 'Cardano native asset')} • Cardano native asset • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano native asset'} • Cardano native asset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoNativeAsset, data.selector)}

	<CardanoNativeAssetView
		selection={pageSelection}
	/>
	{/if}
</Page>
