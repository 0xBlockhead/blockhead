<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


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
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$marketVenues',
		}}
		id="market-venues-page"
		open
	/>
</Page>
