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

	const pageSelection = $derived(select(EntityType.DydxChainMarket, data.selector, {
		sources: [
			Source.DydxIndexer,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import DydxChainMarketView from '$/views/DydxChainMarketView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.ticker || 'dydx chain market')} • dydx chain market • Blockhead</title>
</svelte:head>


<Page>
	<DydxChainMarketView
		selection={pageSelection}
	/>
</Page>
