<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.UniswapCcaAuction_EvmBlock, {
		$auction: {
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: params.chainId,
				},
			},
			auctionAddress: params.auctionAddress,
		},
		blockNumber: BigInt(params.blockNumber),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import UniswapCcaAuction_EvmBlockView from '$/views/UniswapCcaAuction_EvmBlockView.svelte'
</script>


<svelte:head>
	<title>{String(pageSelection.entitySelector.blockNumber) || 'Uniswap CCA auction block'} • Uniswap CCA auction block • Blockhead</title>
</svelte:head>


<Page>
	<UniswapCcaAuction_EvmBlockView
		selection={pageSelection}
	/>
</Page>
