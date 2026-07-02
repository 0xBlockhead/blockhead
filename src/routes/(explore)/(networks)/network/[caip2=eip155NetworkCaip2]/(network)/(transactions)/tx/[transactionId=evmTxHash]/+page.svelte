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
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
</script>


<svelte:head>
	<title>EVM transaction • Blockhead</title>
</svelte:head>


<Page>
	<EvmTransactionView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
				caip2: params.caip2,
				transactionId: params.transactionId,
			})
		}
		selection={
			select(EntityType.EvmTransaction, data.selector, {
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
