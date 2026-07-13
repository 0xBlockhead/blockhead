<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmInternalCallType } from '$/constants/Evm.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmInternalTransfer, {
		$transaction: data.selector,
		indexInTransaction: Number(params.indexInTransaction),
	}, {
		sources: [
			Source.Blockscout_Rest,
		],
		fields: {
			callType: true,
			value: true,
			success: true,
			$from: true,
			$to: true,
			$createdContract: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? (String((pageSelection.entitySelector.indexInTransaction) ?? '') ? 'Internal #' + String((pageSelection.entitySelector.indexInTransaction) ?? '') : '') || 'EVM internal transfer' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInTransaction) ?? '') ? 'Internal #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInTransaction) ?? '') : '') || 'EVM internal transfer')))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmInternalTransferView from '$/views/EvmInternalTransferView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • EVM internal transfer • Blockhead</title>
</svelte:head>


<Page>
	<EvmInternalTransferView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/internal-transfer/[indexInTransaction=nonNegativeInteger]', {
				network: params.network,
				transactionId: params.transactionId,
				indexInTransaction: params.indexInTransaction,
			})
		}
		selection={pageSelection}
	/>
</Page>
