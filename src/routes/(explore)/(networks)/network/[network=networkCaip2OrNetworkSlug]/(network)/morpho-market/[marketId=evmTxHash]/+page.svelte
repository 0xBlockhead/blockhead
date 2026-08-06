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

	const pageSelection = $derived(select(EntityType.MorphoMarket, data.selector, {
		sources: [
			Source.Morpho_Rest,
			Source.Morpho_Graphql,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MorphoMarketView from '$/views/MorphoMarketView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.marketId || 'Morpho market')} • Morpho market • Blockhead</title>
</svelte:head>


<Page>
	<MorphoMarketView
		selection={pageSelection}
	/>
</Page>
