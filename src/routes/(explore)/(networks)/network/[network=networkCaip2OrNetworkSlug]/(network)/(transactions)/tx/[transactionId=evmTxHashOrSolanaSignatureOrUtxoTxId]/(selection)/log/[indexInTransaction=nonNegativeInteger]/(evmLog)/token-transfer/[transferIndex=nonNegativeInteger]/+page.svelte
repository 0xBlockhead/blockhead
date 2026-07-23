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
			Nft: {
				fields: {
					tokenId: true,
				},
			},
			$from: true,
			$to: true,
			$coinInstance: true,
			$tokenContract: true,
			tokenSymbol: true,
			tokenName: true,
			tokenDecimals: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTokenTransferView from '$/views/EvmTokenTransferView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? (String(({
		$log: data.selector,
		indexInLog: Number(params.transferIndex),
	}.indexInLog) ?? '') ? 'Transfer #' + String(({
		$log: data.selector,
		indexInLog: Number(params.transferIndex),
	}.indexInLog) ?? '') : '') || 'Token transfer' : (String((({ ...{
		$log: data.selector,
		indexInLog: Number(params.transferIndex),
	}, ...pageSelection.entity }).indexInLog) ?? '') ? 'Transfer #' + String((({ ...{
		$log: data.selector,
		indexInLog: Number(params.transferIndex),
	}, ...pageSelection.entity }).indexInLog) ?? '') : '') || 'Token transfer'))} • Token transfer • Blockhead</title>
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
