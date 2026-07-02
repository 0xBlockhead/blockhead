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
	import CosmosTransactionView from '$/views/CosmosTransactionView.svelte'
</script>


<svelte:head>
	<title>Cosmos transaction • Blockhead</title>
</svelte:head>


<Page>
	<CosmosTransactionView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/tx/[txHash]', {
				caip2: params.caip2,
				txHash: params.txHash,
			})
		}
		selection={
			select(EntityType.CosmosTransaction, data.selector, {
				fields: {
					code: true,
					gasUsed: true,
					codespace: true,
					gasWanted: true,
					feeAmount: true,
					feeGasLimit: true,
					memo: true,
					timeoutHeight: true,
					signerAddresses: true,
					signatures: true,
					eventTypes: true,
					$block: true,
					rawLog: true,
				},
			})
		}
	/>
</Page>
