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
	import UtxoInputsView from '$/views/UtxoInputsView.svelte'
</script>


<svelte:head>
	<title>UTXO inputs • Blockhead</title>
</svelte:head>


<Page>
	<UtxoInputsView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/inputs', {
				network: params.network,
				transactionId: params.transactionId,
			})
		}
		title='UTXO inputs'
		selection={
			select(EntityType.UtxoTransaction, data.selector).$$inputs({
				count: true,
			})
		}
		id='inputs'
	/>
</Page>
