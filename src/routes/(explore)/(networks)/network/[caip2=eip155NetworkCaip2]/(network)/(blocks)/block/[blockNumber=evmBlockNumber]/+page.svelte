<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<svelte:head>
	<title>EVM block • Blockhead</title>
</svelte:head>


<Page>
	<EvmBlockView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]', {
				caip2: params.caip2,
				blockNumber: params.blockNumber,
			})
		}
		selection={
			select(EntityType.EvmBlock, data.selector, {
				fields: {
					transactionCount: true,
					timestamp: true,
					gasUsed: true,
					gasLimit: true,
					baseFeePerGas: true,
					blobGasUsed: true,
					excessBlobGas: true,
					$parent: true,
					$miner: true,
				},
			})
		}
	/>
</Page>
