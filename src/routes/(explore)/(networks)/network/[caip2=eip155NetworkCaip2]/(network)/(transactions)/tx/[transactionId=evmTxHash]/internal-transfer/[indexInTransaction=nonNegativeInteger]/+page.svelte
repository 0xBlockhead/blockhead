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
	import EvmInternalTransferView from '$/views/EvmInternalTransferView.svelte'
</script>


<svelte:head>
	<title>EVM internal transfer • Blockhead</title>
</svelte:head>


<Page>
	<EvmInternalTransferView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/internal-transfer/[indexInTransaction=nonNegativeInteger]', {
				caip2: params.caip2,
				transactionId: params.transactionId,
				indexInTransaction: params.indexInTransaction,
			})
		}
		selection={
			select(EntityType.EvmInternalTransfer, data.selector, {
				fields: {
					callType: true,
					value: true,
					success: true,
					$from: true,
					$to: true,
					$createdContract: true,
				},
			})
		}
	/>
</Page>
