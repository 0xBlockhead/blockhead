<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetwork_GasFee_BlockView from '$/views/EvmNetwork_GasFee_BlockView.svelte'
</script>


<Page>
	<EvmNetwork_GasFee_BlockView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/fee-market/block/[blockNumber=evmBlockNumber]', {
				caip2: params.caip2,
				blockNumber: params.blockNumber,
			})
		}
		selection={
			select(EntityType.EvmNetwork_GasFee_Block, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				blockNumber: BigInt(params.blockNumber),
			}, {
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
