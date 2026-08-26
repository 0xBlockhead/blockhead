<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StellarLiquidityPool, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import StellarLiquidityPoolView from '$/views/StellarLiquidityPoolView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'stellar liquidity pool'} • stellar liquidity pool • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar liquidity pool'} • stellar liquidity pool • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StellarLiquidityPoolView
		selection={pageSelection}
	/>
	{/if}
</Page>
