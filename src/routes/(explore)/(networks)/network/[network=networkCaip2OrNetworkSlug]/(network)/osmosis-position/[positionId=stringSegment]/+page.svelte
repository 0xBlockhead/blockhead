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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import OsmosisPositionView from '$/views/OsmosisPositionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.OsmosisPosition, data.selector, {
					sources: [
						Source.Osmosis_LCD_Rest,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.positionId || 'Osmosis position')} • Osmosis position • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Osmosis position'} • Osmosis position • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.OsmosisPosition, data.selector, {
					sources: [
						Source.Osmosis_LCD_Rest,
					],
				}))}

		<OsmosisPositionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
