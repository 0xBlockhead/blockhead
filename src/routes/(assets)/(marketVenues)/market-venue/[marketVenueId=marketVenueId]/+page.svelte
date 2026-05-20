<script lang="ts">
	// Types/constants
	import { marketVenueById, type MarketVenueId } from '$/constants/MarketVenue.ts'


	const marketVenueIdFromParam = (param: string): MarketVenueId | null => (
		marketVenueById[param as MarketVenueId]?.id ?? null
	)


	// Context
	import { resolve } from '$app/paths'


	// State
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
			href={resolve(
				'/(assets)/(marketVenues)/market-venue/[marketVenueId]',
				{ marketVenueId: route.marketVenueId },
			)}
		/>
	{/if}
</Page>
