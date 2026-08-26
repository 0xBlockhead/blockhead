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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.UniswapV3Pool_Block, {
		$pool: {
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: params.chainId,
				},
			},
			poolAddress: params.poolAddress,
		},
		blockNumber: BigInt(params.blockNumber),
	}, {
		sources: [
			Source.Voltaire_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import UniswapV3Pool_BlockView from '$/views/UniswapV3Pool_BlockView.svelte'
</script>


<svelte:head>
	<title>{String(pageSelection.entitySelector.blockNumber) || 'Uniswap V3 pool block'} • Uniswap V3 pool block • Blockhead</title>
</svelte:head>


<Page>
	<UniswapV3Pool_BlockView
		selection={pageSelection}
	/>
</Page>
