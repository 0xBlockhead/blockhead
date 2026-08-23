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
	import OsmosisPoolView from '$/views/OsmosisPoolView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.OsmosisPool, data.selector, {
					sources: [
						Source.Osmosis_LCD_Rest,
					],
					fields: {
						typeUrl: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.poolId ?? '') || 'Osmosis pool' : [pageSelection.entitySelector.poolId, (pageSelection.entity.typeUrl ?? '')].filter(Boolean).join(' ') || 'Osmosis pool')} • Osmosis pool • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Osmosis pool'} • Osmosis pool • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.OsmosisPool, data.selector, {
					sources: [
						Source.Osmosis_LCD_Rest,
					],
					fields: {
						typeUrl: true,
					},
				}))}

		<OsmosisPoolView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
