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

	const pageSelection = $derived(select(EntityType.UtxoInput, {
		$transaction: data.selector,
		indexInTransaction: Number(params.inputIndex),
	}, {
		fields: {
			$spentOutput: true,
			coinbaseScript: true,
			scriptSigAsm: true,
			sequence: true,
			witness: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? (String((pageSelection.entitySelector.indexInTransaction) ?? '') ? 'Input #' + String((pageSelection.entitySelector.indexInTransaction) ?? '') : '') || 'UTXO input' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInTransaction) ?? '') ? 'Input #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInTransaction) ?? '') : '') || 'UTXO input')))


	// Components
	import Page from '$/components/Page.svelte'
	import UtxoInputView from '$/views/UtxoInputView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • UTXO input • Blockhead</title>
</svelte:head>


<Page>
	<UtxoInputView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/input/[inputIndex=nonNegativeInteger]', {
				network: params.network,
				transactionId: params.transactionId,
				inputIndex: params.inputIndex,
			})
		}
		selection={pageSelection}
	/>
</Page>
