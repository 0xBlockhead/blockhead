<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import OsmosisPoolAssetView from '$/views/OsmosisPoolAssetView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.OsmosisPoolAsset, {
					$pool: data.selector,
					denom: params.denom,
				}, {
					sources: [
						Source.Osmosis_LCD_Rest,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.denom || 'Osmosis pool asset')} • Osmosis pool asset • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Osmosis pool asset'} • Osmosis pool asset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.OsmosisPoolAsset, {
					$pool: data.selector,
					denom: params.denom,
				}, {
					sources: [
						Source.Osmosis_LCD_Rest,
					],
				}))}

		<OsmosisPoolAssetView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
