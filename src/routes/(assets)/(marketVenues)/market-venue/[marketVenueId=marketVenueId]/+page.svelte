<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { MarketVenueId } from '$/constants/MarketVenue.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.MarketVenue, {
		marketVenueId: params.marketVenueId,
	}, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MarketVenueView from '$/views/MarketVenueView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? [String(({
		marketVenueId: params.marketVenueId,
	}.marketVenueId) ?? '')].filter(Boolean).join(' ') || 'Market venue' : [String((({ ...{
		marketVenueId: params.marketVenueId,
	}, ...pageSelection.entity }).label) ?? '')].filter(Boolean).join(' ') || [String((({ ...{
		marketVenueId: params.marketVenueId,
	}, ...pageSelection.entity }).marketVenueId) ?? '')].filter(Boolean).join(' ') || 'Market venue')} • Market venue • Blockhead</title>
</svelte:head>


<Page>
	<MarketVenueView
		href={
			resolve('/market-venue/[marketVenueId=marketVenueId]', {
				marketVenueId: params.marketVenueId,
			})
		}
		selection={pageSelection}
	/>
</Page>
