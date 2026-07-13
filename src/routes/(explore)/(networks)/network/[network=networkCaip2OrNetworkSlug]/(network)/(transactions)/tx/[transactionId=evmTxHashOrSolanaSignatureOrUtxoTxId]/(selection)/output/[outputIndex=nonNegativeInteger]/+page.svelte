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

	const pageSelection = $derived(select(EntityType.UtxoOutput, data.selector, {
		fields: {
			$address: true,
			isSpent: true,
			valueSats: true,
			scriptPubKeyType: true,
			isConfidential: true,
			scriptPubKeyAsm: true,
			scriptPubKeyHex: true,
			assetCommitment: true,
			valueCommitment: true,
			nonceCommitment: true,
			surjectionProof: true,
			rangeProof: true,
			$bitcoinCashCashTokenFungibleAmount: true,
			$bitcoinCashCashTokenNft: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? (String((pageSelection.entitySelector.indexInTransaction) ?? '') ? 'Output #' + String((pageSelection.entitySelector.indexInTransaction) ?? '') : '') || 'UTXO output' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInTransaction) ?? '') ? 'Output #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInTransaction) ?? '') : '') || 'UTXO output')))


	// Components
	import Page from '$/components/Page.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • UTXO output • Blockhead</title>
</svelte:head>


<Page>
	<UtxoOutputView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
				network: params.network,
				transactionId: params.transactionId,
				outputIndex: params.outputIndex,
			})
		}
		selection={pageSelection}
	/>
</Page>
