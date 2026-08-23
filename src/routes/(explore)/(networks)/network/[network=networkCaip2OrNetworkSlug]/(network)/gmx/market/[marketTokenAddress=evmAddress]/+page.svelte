<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import GmxMarketView from '$/views/GmxMarketView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GmxMarket, {
					$network: data.selector,
					marketTokenAddress: params.marketTokenAddress,
				}, {
					sources: [
						Source.Gmx_Rest,
					],
					fields: {
						name: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'GMX market' : pageSelection.entity.name || 'GMX market')} • GMX market • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'GMX market'} • GMX market • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GmxMarket, {
					$network: data.selector,
					marketTokenAddress: params.marketTokenAddress,
				}, {
					sources: [
						Source.Gmx_Rest,
					],
					fields: {
						name: true,
					},
				}))}

		<GmxMarketView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
