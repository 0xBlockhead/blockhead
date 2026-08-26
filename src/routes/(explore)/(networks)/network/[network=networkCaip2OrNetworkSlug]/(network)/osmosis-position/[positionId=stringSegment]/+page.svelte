<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.OsmosisPosition, data.selector, {
		sources: [
			Source.Osmosis_LCD_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import OsmosisPositionView from '$/views/OsmosisPositionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.positionId || 'Osmosis position')} • Osmosis position • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Osmosis position'} • Osmosis position • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<OsmosisPositionView
		selection={pageSelection}
	/>
	{/if}
</Page>
