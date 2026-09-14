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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.LiquidityPoolFeeSchedule, data.selector, {
		sources: [
			Source.TheGraph_Graphql,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPoolFeeScheduleView from '$/views/LiquidityPoolFeeScheduleView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.feeType || 'liquidity pool fee schedule')} • liquidity pool fee schedule • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'liquidity pool fee schedule'} • liquidity pool fee schedule • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<LiquidityPoolFeeScheduleView
		selection={pageSelection}
	/>
	{/if}
</Page>
