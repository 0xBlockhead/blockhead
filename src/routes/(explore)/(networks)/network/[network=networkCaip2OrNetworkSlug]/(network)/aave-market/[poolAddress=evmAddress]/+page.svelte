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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AaveMarket, data.selector, {
		sources: [
			Source.Aave_Rest,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AaveMarketView from '$/views/AaveMarketView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Aave market' : pageSelection.entity.name || 'Aave market')} • Aave market • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Aave market'} • Aave market • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AaveMarketView
		selection={pageSelection}
	/>
	{/if}
</Page>
