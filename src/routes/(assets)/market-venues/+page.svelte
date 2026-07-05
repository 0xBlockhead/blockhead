<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
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
		href={resolve('/(assets)/market-venues')}
		title='Market venues'
		selection={
			select(EntityType._Global, {
				scope: '$$marketVenues',
			})[EntityProxyField]<EntityType.MarketVenue>('$$marketVenues')
		}
		id='market-venues'
	/>
</Page>
