<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import StellarLiquidityPoolView from '$/views/StellarLiquidityPoolView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.StellarLiquidityPool, data.selector))}
			<title>{data?.title ?? 'stellar liquidity pool'} • stellar liquidity pool • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'stellar liquidity pool'} • stellar liquidity pool • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.StellarLiquidityPool, data.selector))}

		<StellarLiquidityPoolView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
