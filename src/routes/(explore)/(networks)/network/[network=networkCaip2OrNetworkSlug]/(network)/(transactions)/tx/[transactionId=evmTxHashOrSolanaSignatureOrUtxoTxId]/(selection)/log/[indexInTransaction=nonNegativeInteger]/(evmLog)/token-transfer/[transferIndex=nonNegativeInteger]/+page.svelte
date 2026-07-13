<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmTokenStandard } from '$/constants/Evm.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmTokenTransfer, {
		$log: data.selector,
		indexInLog: Number(params.transferIndex),
	}, {
		sources: [
			Source.Blockscout_Rest,
		],
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
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? (String((pageSelection.entitySelector.indexInLog) ?? '') ? 'Transfer #' + String((pageSelection.entitySelector.indexInLog) ?? '') : '') || 'Token transfer' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInLog) ?? '') ? 'Transfer #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInLog) ?? '') : '') || 'Token transfer')))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTokenTransferView from '$/views/EvmTokenTransferView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Token transfer • Blockhead</title>
</svelte:head>


<Page>
	<EvmTokenTransferView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]/token-transfer/[transferIndex=nonNegativeInteger]', {
				network: params.network,
				transactionId: params.transactionId,
				indexInTransaction: params.indexInTransaction,
				transferIndex: params.transferIndex,
			})
		}
		selection={pageSelection}
	/>
</Page>
