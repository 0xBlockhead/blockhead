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
	import AlgorandAssetView from '$/views/AlgorandAssetView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AlgorandAsset, data.selector)}
		<title>{data?.title ?? (String(pageSelection.entitySelector.assetId) || 'algorand asset')} • algorand asset • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'algorand asset'} • algorand asset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AlgorandAsset, data.selector)}

	<AlgorandAssetView
		selection={pageSelection}
	/>
	{/if}
</Page>
