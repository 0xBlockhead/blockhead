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
	import UtxoOutputsView from '$/views/UtxoOutputsView.svelte'
</script>


<svelte:head>
	<title>UTXO outputs • Blockhead</title>
</svelte:head>


<Page>
	<UtxoOutputsView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/outputs', {
				network: params.network,
				transactionId: params.transactionId,
			})
		}
		title='UTXO outputs'
		selection={select(EntityType.UtxoTransaction, data.selector).$$outputs}
		id='outputs'
	/>
</Page>
