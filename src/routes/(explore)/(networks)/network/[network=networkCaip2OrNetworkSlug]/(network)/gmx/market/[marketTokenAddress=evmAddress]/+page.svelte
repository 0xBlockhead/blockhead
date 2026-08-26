<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.GmxMarket, {
		$network: data.selector,
		marketTokenAddress: params.marketTokenAddress,
	}, {
		sources: [
			Source.Gmx_Rest,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GmxMarketView from '$/views/GmxMarketView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'GMX market' : pageSelection.entity.name || 'GMX market')} • GMX market • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'GMX market'} • GMX market • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GmxMarketView
		selection={pageSelection}
	/>
	{/if}
</Page>
