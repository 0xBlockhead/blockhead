<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(
		(
			data.entityType === EntityType.CardanoTxOutput && data.selectorName === 'TransactionOutputIndex' ?
				select(EntityType.CardanoTxOutput, data.selector, {
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
				})
			:
				select(EntityType.UtxoOutput, data.selector, {
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
				})
		)
	)
	const pageTitle = $derived(
		(
			data.entityType === EntityType.CardanoTxOutput && data.selectorName === 'TransactionOutputIndex' ?
				(String(data.selector.outputIndex) || 'Cardano transaction output')
			:
				((String(data.selector.indexInTransaction ?? '') ? 'Output #' + String(data.selector.indexInTransaction ?? '') : '') || 'UTXO output')
		)
	)
	const entityViewByType = {
		[EntityType.CardanoTxOutput]: {
			Component: CardanoTxOutputView,
			label: 'Cardano transaction output',
		},
		[EntityType.UtxoOutput]: {
			Component: UtxoOutputView,
			label: 'UTXO output',
		},
	}

	// Components
	import Page from '$/components/Page.svelte'
	import CardanoTxOutputView from '$/views/CardanoTxOutputView.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<svelte:head>
	<title>{pageTitle} • {entityViewByType[data.entityType].label} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType].Component}

	<EntityView
		selection={pageSelection}
	/>
</Page>
