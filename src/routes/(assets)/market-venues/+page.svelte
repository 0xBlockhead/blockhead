<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import MarketVenuesView from '$/views/MarketVenuesView.svelte'
</script>


<svelte:head>
	<title>Market venues • Blockhead</title>
</svelte:head>


<Page>
	<MarketVenuesView
		href={resolve('/market-venues')}
		title='Market venues'
		selection={
			select(EntityType._Global, {
				scope: '$$marketVenues',
			}).$$marketVenues({
				count: true,
			})
		}
		id='market-venues'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
