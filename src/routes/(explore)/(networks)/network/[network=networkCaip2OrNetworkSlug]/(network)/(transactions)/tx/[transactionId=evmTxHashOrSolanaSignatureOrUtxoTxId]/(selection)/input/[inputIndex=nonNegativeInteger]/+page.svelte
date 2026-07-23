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

	const pageSelection = $derived(data.entityType === EntityType.CardanoTxInput && data.selectorName === 'TransactionInputIndex' ? select(EntityType.CardanoTxInput, data.selector, {
		sources: [
			Source.Blockfrost_Rest,
		],
		fields: {
			inputKind: true,
			spentTxHash: true,
			spentOutputIndex: true,
			$spentOutput: true,
			redeemerIndex: true,
		},
	}) : select(EntityType.UtxoInput, data.selector, {
		fields: {
			$spentOutput: true,
			coinbaseScript: true,
			scriptSigAsm: true,
			sequence: true,
			witness: true,
		},
	}))
	const entityViewComponentByType = {
		[EntityType.CardanoTxInput]: CardanoTxInputView,
		[EntityType.UtxoInput]: UtxoInputView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import CardanoTxInputView from '$/views/CardanoTxInputView.svelte'
	import UtxoInputView from '$/views/UtxoInputView.svelte'
</script>


<svelte:head>
	<title>{data.entityType === EntityType.CardanoTxInput && data.selectorName === 'TransactionInputIndex' ? (pageSelection.entity == null ? [(String((data.selector.inputIndex) ?? '') ? 'Input ' + String((data.selector.inputIndex) ?? '') : '')].filter(Boolean).join(' ') || 'Cardano transaction input' : [(String((({ ...data.selector, ...pageSelection.entity }).inputIndex) ?? '') ? 'Input ' + String((({ ...data.selector, ...pageSelection.entity }).inputIndex) ?? '') : '')].filter(Boolean).join(' ') || 'Cardano transaction input') : (pageSelection.entity == null ? (String((data.selector.indexInTransaction) ?? '') ? 'Input #' + String((data.selector.indexInTransaction) ?? '') : '') || 'UTXO input' : (String((({ ...data.selector, ...pageSelection.entity }).indexInTransaction) ?? '') ? 'Input #' + String((({ ...data.selector, ...pageSelection.entity }).indexInTransaction) ?? '') : '') || 'UTXO input')} • {data.entityType === EntityType.CardanoTxInput && data.selectorName === 'TransactionInputIndex' ? 'Cardano transaction input' : 'UTXO input'} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewComponentByType[data.entityType]}

	<EntityView
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
