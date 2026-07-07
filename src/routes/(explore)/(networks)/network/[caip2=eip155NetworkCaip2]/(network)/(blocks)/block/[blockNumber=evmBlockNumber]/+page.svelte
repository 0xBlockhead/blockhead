<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<Page>
	<EvmBlockView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]', {
				caip2: params.caip2,
				blockNumber: params.blockNumber,
			})
		}
		selection={
			select(EntityType.EvmBlock, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				blockNumber: BigInt(params.blockNumber),
			}, {
				sources: [
					Source.Voltaire_JsonRpc,
				],
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
