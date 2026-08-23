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
	import PendleMarketView from '$/views/PendleMarketView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.PendleMarket, data.selector, {
				sources: [
					Source.Pendle_Rest,
				],
				fields: {
					name: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Pendle market' : pageSelection.entity.name || 'Pendle market')} • Pendle market • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Pendle market'} • Pendle market • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.PendleMarket, data.selector, {
				sources: [
					Source.Pendle_Rest,
				],
				fields: {
					name: true,
				},
			})}

	<PendleMarketView
		selection={pageSelection}
	/>
	{/if}
</Page>
