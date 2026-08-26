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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.OsmosisPoolAsset, {
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
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.denom || 'Osmosis pool asset')} • Osmosis pool asset • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Osmosis pool asset'} • Osmosis pool asset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<OsmosisPoolAssetView
		selection={pageSelection}
	/>
	{/if}
</Page>
