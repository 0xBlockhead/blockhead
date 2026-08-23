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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AlgorandAsset, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import AlgorandAssetView from '$/views/AlgorandAssetView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.assetId) || 'algorand asset')} • algorand asset • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'algorand asset'} • algorand asset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AlgorandAssetView
		selection={pageSelection}
	/>
	{/if}
</Page>
