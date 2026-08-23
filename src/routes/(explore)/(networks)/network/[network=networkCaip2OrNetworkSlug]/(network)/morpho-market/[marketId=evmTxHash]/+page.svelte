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


	// Components
	import Page from '$/components/Page.svelte'
	import MorphoMarketView from '$/views/MorphoMarketView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.MorphoMarket, data.selector, {
				sources: [
					Source.Morpho_Graphql,
					Source.Morpho_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.marketId || 'Morpho market')} • Morpho market • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Morpho market'} • Morpho market • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.MorphoMarket, data.selector, {
				sources: [
					Source.Morpho_Graphql,
					Source.Morpho_Rest,
				],
			})}

	<MorphoMarketView
		selection={pageSelection}
	/>
	{/if}
</Page>
