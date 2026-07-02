<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import MarketVenueView from '$/views/MarketVenueView.svelte'
</script>


<svelte:head>
	<title>Market venue • Blockhead</title>
</svelte:head>


<Page>
	<MarketVenueView
		href={
			resolve('/(assets)/(marketVenues)/market-venue/[marketVenueId=marketVenueId]', {
				marketVenueId: params.marketVenueId,
			})
		}
		selection={
			select(EntityType.MarketVenue, data.selector, {
				fields: {
					label: true,
				},
			})
		}
	/>
</Page>
