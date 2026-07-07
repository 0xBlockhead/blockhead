<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import MarketVenueView from '$/views/MarketVenueView.svelte'
</script>


<Page>
	<MarketVenueView
		href={
			resolve('/(assets)/(marketVenues)/market-venue/[marketVenueId=marketVenueId]', {
				marketVenueId: params.marketVenueId,
			})
		}
		selection={
			select(EntityType.MarketVenue, {
				marketVenueId: params.marketVenueId,
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					label: true,
				},
			})
		}
	/>
</Page>
