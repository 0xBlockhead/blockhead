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

	const pageSelection = $derived(select(EntityType.UniswapV3Position_Block, {
		$position: {
			positionManager: params.positionManager,
			tokenId: BigInt(params.tokenId),
		},
		blockNumber: BigInt(params.blockNumber),
	}, {
		sources: [
			Source.Voltaire_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import UniswapV3Position_BlockView from '$/views/UniswapV3Position_BlockView.svelte'
</script>


<svelte:head>
	<title>{String(pageSelection.entitySelector.blockNumber) || 'Uniswap V3 position block'} • Uniswap V3 position block • Blockhead</title>
</svelte:head>


<Page>
	<UniswapV3Position_BlockView
		selection={pageSelection}
	/>
</Page>
