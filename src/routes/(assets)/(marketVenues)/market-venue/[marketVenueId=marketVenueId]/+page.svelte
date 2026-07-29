<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
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
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.marketVenueId ?? '') || 'Market venue' : pageSelection.entity.label || pageSelection.entitySelector.marketVenueId || 'Market venue'} • Market venue • Blockhead</title>
</svelte:head>


<Page>
	<MarketVenueView
		selection={pageSelection}
	/>
</Page>
