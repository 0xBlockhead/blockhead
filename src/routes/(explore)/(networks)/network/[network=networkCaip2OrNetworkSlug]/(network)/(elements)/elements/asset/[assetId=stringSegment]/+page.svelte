<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ElementsAssetView from '$/views/ElementsAssetView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ElementsAsset, data.selector, {
				sources: [
					Source.Esplora_Rest,
				],
				fields: {
					name: true,
					ticker: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.assetId ?? '') || 'Elements asset' : [(pageSelection.entity.name ?? ''), (pageSelection.entity.ticker ?? ''), pageSelection.entitySelector.assetId].filter(Boolean).join(' ') || 'Elements asset')} • Elements asset • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Elements asset'} • Elements asset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ElementsAsset, data.selector, {
				sources: [
					Source.Esplora_Rest,
				],
				fields: {
					name: true,
					ticker: true,
				},
			})}

	<ElementsAssetView
		selection={pageSelection}
	/>
	{/if}
</Page>
