<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import MarketVenuesView from '$/views/MarketVenuesView.svelte'
</script>


<svelte:head>
	<title>Market venues</title>
</svelte:head>


<Page>
	<MarketVenuesView
		href={resolve('/market-venues')}
		selection={select(
			EntityType._Global,
			{ scope: '$$marketVenues' }
		).$$marketVenues}
		id="market-venues-page"
		open
	/>
</Page>
