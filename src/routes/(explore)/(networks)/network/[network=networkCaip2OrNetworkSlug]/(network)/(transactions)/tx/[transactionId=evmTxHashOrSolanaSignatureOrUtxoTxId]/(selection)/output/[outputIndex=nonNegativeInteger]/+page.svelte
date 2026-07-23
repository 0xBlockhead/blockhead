<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data.entityType === EntityType.CardanoTxOutput && data.selectorName === 'TransactionOutputIndex' ? select(EntityType.CardanoTxOutput, data.selector, {
		sources: [
			Source.Blockfrost_Rest,
		],
		fields: {
			lovelace: true,
			address: true,
			$address: true,
			datumHash: true,
			referenceScriptHash: true,
		},
	}) : select(EntityType.UtxoOutput, data.selector, {
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
	const entityViewComponentByType = {
		[EntityType.CardanoTxOutput]: CardanoTxOutputView,
		[EntityType.UtxoOutput]: UtxoOutputView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import CardanoTxOutputView from '$/views/CardanoTxOutputView.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<svelte:head>
	<title>{data.entityType === EntityType.CardanoTxOutput && data.selectorName === 'TransactionOutputIndex' ? (pageSelection.entity == null ? [String((data.selector.outputIndex) ?? '')].filter(Boolean).join(' ') || 'Cardano transaction output' : [String((({ ...data.selector, ...pageSelection.entity }).outputIndex) ?? '')].filter(Boolean).join(' ') || 'Cardano transaction output') : (pageSelection.entity == null ? (String((data.selector.indexInTransaction) ?? '') ? 'Output #' + String((data.selector.indexInTransaction) ?? '') : '') || 'UTXO output' : (String((({ ...data.selector, ...pageSelection.entity }).indexInTransaction) ?? '') ? 'Output #' + String((({ ...data.selector, ...pageSelection.entity }).indexInTransaction) ?? '') : '') || 'UTXO output')} • {data.entityType === EntityType.CardanoTxOutput && data.selectorName === 'TransactionOutputIndex' ? 'Cardano transaction output' : 'UTXO output'} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewComponentByType[data.entityType]}

	<EntityView
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
