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


	// Components
	import Page from '$/components/Page.svelte'
	import EvmInternalTransferView from '$/views/EvmInternalTransferView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? (String(({
		$transaction: data.selector,
		indexInTransaction: Number(params.indexInTransaction),
	}.indexInTransaction) ?? '') ? 'Internal #' + String(({
		$transaction: data.selector,
		indexInTransaction: Number(params.indexInTransaction),
	}.indexInTransaction) ?? '') : '') || 'EVM internal transfer' : (String((({ ...{
		$transaction: data.selector,
		indexInTransaction: Number(params.indexInTransaction),
	}, ...pageSelection.entity }).indexInTransaction) ?? '') ? 'Internal #' + String((({ ...{
		$transaction: data.selector,
		indexInTransaction: Number(params.indexInTransaction),
	}, ...pageSelection.entity }).indexInTransaction) ?? '') : '') || 'EVM internal transfer'))} • EVM internal transfer • Blockhead</title>
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
