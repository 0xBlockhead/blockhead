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

	const pageSelection = $derived(select(EntityType.UniswapV3Pool, data.selector, {
		sources: [
			Source.Voltaire_JsonRpc,
			Source.UniswapContracts_Evm,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import UniswapV3PoolView from '$/views/UniswapV3PoolView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.poolAddress || 'Uniswap V3 pool')} • Uniswap V3 pool • Blockhead</title>
</svelte:head>


<Page>
	<UniswapV3PoolView
		selection={pageSelection}
	/>
</Page>
