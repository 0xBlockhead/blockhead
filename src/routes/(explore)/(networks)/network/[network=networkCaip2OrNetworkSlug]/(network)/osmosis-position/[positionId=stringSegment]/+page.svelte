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

	const pageSelection = $derived(select(EntityType.OsmosisPosition, data.selector, {
		sources: [
			Source.Osmosis_LCD_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import OsmosisPositionView from '$/views/OsmosisPositionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.positionId || 'Osmosis position')} • Osmosis position • Blockhead</title>
</svelte:head>


<Page>
	<OsmosisPositionView
		selection={pageSelection}
	/>
</Page>
