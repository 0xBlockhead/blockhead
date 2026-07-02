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
	import EvmTokenTransferView from '$/views/EvmTokenTransferView.svelte'
</script>


<svelte:head>
	<title>Token transfer • Blockhead</title>
</svelte:head>


<Page>
	<EvmTokenTransferView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/token-transfer/[indexInTransaction=nonNegativeInteger]/[indexInLog=nonNegativeInteger]', {
				caip2: params.caip2,
				transactionId: params.transactionId,
				indexInTransaction: params.indexInTransaction,
				indexInLog: params.indexInLog,
			})
		}
		selection={
			select(EntityType.EvmTokenTransfer, data.selector, {
				fields: {
					standard: true,
					amount: true,
					tokenId: true,
					$from: true,
					$to: true,
					$coinInstance: true,
					$tokenContract: true,
					tokenSymbol: true,
					tokenName: true,
					tokenDecimals: true,
				},
			})
		}
	/>
</Page>
