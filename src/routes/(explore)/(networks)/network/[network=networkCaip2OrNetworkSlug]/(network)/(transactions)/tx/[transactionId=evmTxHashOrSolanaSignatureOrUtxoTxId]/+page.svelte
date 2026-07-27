<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmTransactionEnvelopeType, EvmTransactionExecutionStatus, EvmTransactionKind } from '$/constants/Evm.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(
		(
			data.entityType === EntityType.EvmTransaction && data.selectorName === 'EvmNetworkTxHash' ?
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
			data.entityType === EntityType.SolanaTransaction && data.selectorName === 'NetworkSignature' ?
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
			data.entityType === EntityType.CardanoTransaction && data.selectorName === 'NetworkHash' ?
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
		)
	)
	const pageTitle = $derived(
		(
			data.entityType === EntityType.EvmTransaction && data.selectorName === 'EvmNetworkTxHash' ?
				(data.selector.txHash || 'EVM transaction')
			:
			data.entityType === EntityType.SolanaTransaction && data.selectorName === 'NetworkSignature' ?
				(data.selector.signature || 'solana transaction')
			:
			data.entityType === EntityType.CardanoTransaction && data.selectorName === 'NetworkHash' ?
				(data.selector.hash || 'Cardano transaction')
			:
				(data.selector.txId || 'UTXO transaction')
		)
	)
	const entityViewByType = {
		[EntityType.EvmTransaction]: {
			Component: EvmTransactionView,
			label: 'EVM transaction',
		},
		[EntityType.SolanaTransaction]: {
			Component: SolanaTransactionView,
			label: 'solana transaction',
		},
		[EntityType.CardanoTransaction]: {
			Component: CardanoTransactionView,
			label: 'Cardano transaction',
		},
		[EntityType.UtxoTransaction]: {
			Component: UtxoTransactionView,
			label: 'UTXO transaction',
		},
	}

	// Components
	import Page from '$/components/Page.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
	import CardanoTransactionView from '$/views/CardanoTransactionView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
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
