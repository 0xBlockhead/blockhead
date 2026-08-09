<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.PendleMarket, data.selector, {
		sources: [
			Source.Pendle_Rest,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PendleMarketView from '$/views/PendleMarketView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Pendle market' : pageSelection.entity.name || 'Pendle market')} • Pendle market • Blockhead</title>
</svelte:head>


<Page>
	<PendleMarketView
		selection={pageSelection}
	/>
</Page>
