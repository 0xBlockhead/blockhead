<!-- Generated from APP.ts. -->

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

	const documentTitle = $derived(
		(
			data.entityType === EntityType.EvmTransaction ?
				(data.selector.txHash || 'EVM transaction') + ' • EVM transaction • Blockhead'
			:
			data.entityType === EntityType.SolanaTransaction ?
				(data.selector.signature || 'solana transaction') + ' • solana transaction • Blockhead'
			:
			data.entityType === EntityType.CardanoTransaction ?
				(data.selector.hash || 'Cardano transaction') + ' • Cardano transaction • Blockhead'
			:
				(data.selector.txId || 'UTXO transaction') + ' • UTXO transaction • Blockhead'
		)
	)
	const entityViewByType = {
		[EntityType.EvmTransaction]: EvmTransactionView,
		[EntityType.SolanaTransaction]: SolanaTransactionView,
		[EntityType.CardanoTransaction]: CardanoTransactionView,
		[EntityType.UtxoTransaction]: UtxoTransactionView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
	import CardanoTransactionView from '$/views/CardanoTransactionView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<svelte:head>
	<title>{documentTitle}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={
			data.entityType === EntityType.EvmTransaction ?
				select(EntityType.EvmTransaction, data.selector, {
					sources: [
						Source.Blockscout_Rest,
						Source.Voltaire_JsonRpc,
					],
					fields: {
						$block: true,
						$from: true,
						$to: true,
						ContractCreation: {
							fields: {
								$contract: true,
							},
						},
						kind: true,
						value: true,
						executionStatus: true,
						gasUsed: true,
						gas: true,
						gasPrice: true,
						effectiveGasPrice: true,
						FeeMarket: {
							fields: {
								maxFeePerGas: true,
								maxPriorityFeePerGas: true,
							},
						},
						cumulativeGasUsed: true,
						envelopeType: true,
						nonce: true,
						indexInBlock: true,
						input: true,
						r: true,
						s: true,
						v: true,
						Blob: {
							fields: {
								blobGasUsed: true,
								maxFeePerBlobGas: true,
							},
						},
					},
				})
			:
			data.entityType === EntityType.SolanaTransaction ?
				select(EntityType.SolanaTransaction, data.selector, {
					fields: {
						status: true,
						slot: true,
						feeLamports: true,
						computeUnitsConsumed: true,
						$block: true,
						$feePayer: true,
					},
				})
			:
			data.entityType === EntityType.CardanoTransaction ?
				select(EntityType.CardanoTransaction, data.selector, {
					sources: [
						Source.Blockfrost_Rest,
					],
					fields: {
						blockSlot: true,
						fee: true,
						deposit: true,
						sizeBytes: true,
						validityStartSlot: true,
						ttlSlot: true,
					},
				})
			:
				select(EntityType.UtxoTransaction, data.selector, {
					fields: {
						feeSats: true,
						isCoinbase: true,
						version: true,
						lockTime: true,
						sizeBytes: true,
						virtualSizeBytes: true,
						weightUnits: true,
						$block: true,
					},
				})
		}
	/>
</Page>
