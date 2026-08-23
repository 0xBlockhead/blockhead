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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.UniswapV3Position, data.selector, {
		sources: [
			Source.Voltaire_JsonRpc,
			Source.UniswapContracts_Evm,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import UniswapV3PositionView from '$/views/UniswapV3PositionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.tokenId) || 'Uniswap V3 position')} • Uniswap V3 position • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Uniswap V3 position'} • Uniswap V3 position • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<UniswapV3PositionView
		selection={pageSelection}
	/>
	{/if}
</Page>
