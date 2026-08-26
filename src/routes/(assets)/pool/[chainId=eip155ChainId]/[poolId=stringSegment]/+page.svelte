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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.LiquidityPool, data.selector, {
		sources: [
			Source.Dexscreener_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.id || 'liquidity pool')} • liquidity pool • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'liquidity pool'} • liquidity pool • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<LiquidityPoolView
		selection={pageSelection}
	/>
	{/if}
</Page>
