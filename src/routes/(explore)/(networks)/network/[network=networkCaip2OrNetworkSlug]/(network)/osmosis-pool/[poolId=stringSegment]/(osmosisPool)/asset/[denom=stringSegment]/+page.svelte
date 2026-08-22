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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.OsmosisPoolAsset, {
		$pool: data.selector,
		denom: params.denom,
	}, {
		sources: [
			Source.Osmosis_LCD_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import OsmosisPoolAssetView from '$/views/OsmosisPoolAssetView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.denom || 'Osmosis pool asset')} • Osmosis pool asset • Blockhead</title>
</svelte:head>


<Page>
	<OsmosisPoolAssetView
		selection={pageSelection}
	/>
</Page>
