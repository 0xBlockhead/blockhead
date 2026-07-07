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
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
</script>


<Page>
	<EvmTransactionView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
				caip2: params.caip2,
				transactionId: params.transactionId,
			})
		}
		selection={
			select(EntityType.EvmTransaction, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				txHash: decodeURIComponent(params.transactionId),
			}, {
				sources: [
					Source.Blockscout_Rest,
				],
				fields: {
					$block: true,
					$from: true,
					$to: true,
					$contract: true,
					kind: true,
					value: true,
					executionStatus: true,
					gasUsed: true,
					gas: true,
					gasPrice: true,
					effectiveGasPrice: true,
					maxFeePerGas: true,
					maxPriorityFeePerGas: true,
					cumulativeGasUsed: true,
					envelopeType: true,
					nonce: true,
					indexInBlock: true,
					input: true,
					r: true,
					s: true,
					v: true,
					blobGasUsed: true,
					maxFeePerBlobGas: true,
				},
			})
		}
	/>
</Page>
