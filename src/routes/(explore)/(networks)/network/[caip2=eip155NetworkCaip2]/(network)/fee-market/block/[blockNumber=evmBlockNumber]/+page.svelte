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
	import EvmNetwork_GasFee_BlockView from '$/views/EvmNetwork_GasFee_BlockView.svelte'
</script>


<svelte:head>
	<title>EVM network gas fee block • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetwork_GasFee_BlockView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/fee-market/block/[blockNumber=evmBlockNumber]', {
				caip2: params.caip2,
				blockNumber: params.blockNumber,
			})
		}
		selection={
			select(EntityType.EvmNetwork_GasFee_Block, data.selector, {
				fields: {
					baseFeePerGas: true,
					legacyGasPrice: true,
					maxPriorityFeePerGas: true,
					gasUsedRatio: true,
					priorityFeeRewardAt50thPercentile: true,
					baseFeePerBlobGas: true,
					blobGasUsedRatio: true,
				},
			})
		}
	/>
</Page>
