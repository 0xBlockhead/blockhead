<script lang="ts">
	// Types/constants
	import {
		marketVenueById,
		marketVenues,
		type MarketVenueId,
	} from '$/constants/MarketVenue.ts'


	// Props
	let {
		params,
	} = $props()


	// (Derived)
	const route = $derived.by(() => {
		const param = params.marketVenueId ?? ''
		const marketVenueId = marketVenueIdFromParam(param)
		return { param, marketVenueId }
	})


	// Components
	import Page from '$/components/Page.svelte'
	import MarketVenueView from '$/views/MarketVenueView.svelte'


	// Functions
	const marketVenueIdFromParam = (param: string): MarketVenueId | null => (
		marketVenues.find((marketVenue) => marketVenue.id === param)?.id ?? null
	)
</script>


<svelte:head>
	<title>
		{route.marketVenueId ? marketVenueById[route.marketVenueId].label : route.param || 'Market venue'}
	</title>
</svelte:head>


<Page>
	{#if route.marketVenueId == null}
		<h1>
			Not found
		</h1>
		<p>
			Unknown market venue.
		</p>
	{:else}
		<MarketVenueView
			entityId={{ marketVenueId: route.marketVenueId }}
		/>
	{/if}
</Page>
