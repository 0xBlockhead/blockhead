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
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LiquidityPool, data.selector, {
				sources: [
					Source.Dexscreener_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.id || 'liquidity pool')} • liquidity pool • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'liquidity pool'} • liquidity pool • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LiquidityPool, data.selector, {
				sources: [
					Source.Dexscreener_Rest,
				],
			})}

	<LiquidityPoolView
		selection={pageSelection}
	/>
	{/if}
</Page>
