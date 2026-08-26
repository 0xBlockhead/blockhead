<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// Components
	import Page from '$/components/Page.svelte'
	import MarketVenuesView from '$/views/MarketVenuesView.svelte'
</script>


<svelte:head>
	<title>Market venues • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$marketVenues',
	}).$$marketVenues}

	<MarketVenuesView
		href={resolve('/(assets)/market-venues')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='market-venues'
	/>
</Page>
