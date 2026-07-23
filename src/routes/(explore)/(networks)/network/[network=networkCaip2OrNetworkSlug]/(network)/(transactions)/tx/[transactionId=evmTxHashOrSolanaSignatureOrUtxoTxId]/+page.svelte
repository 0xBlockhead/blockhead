<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmTransactionEnvelopeType, EvmTransactionExecutionStatus, EvmTransactionKind } from '$/constants/Evm.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data.entityType === EntityType.EvmTransaction && data.selectorName === 'EvmNetworkTxHash' ? select(EntityType.EvmTransaction, data.selector, {
		sources: [
			Source.Blockscout_Rest,
			Source.EnvioHyperRpc_JsonRpc,
			Source.GetBlockRpc_JsonRpc,
			Source.GoldRushFoundational_Rest,
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
	}) : data.entityType === EntityType.SolanaTransaction && data.selectorName === 'NetworkSignature' ? select(EntityType.SolanaTransaction, data.selector, {
		fields: {
			status: true,
			slot: true,
			feeLamports: true,
			computeUnitsConsumed: true,
			$block: true,
			$feePayer: true,
		},
	}) : data.entityType === EntityType.CardanoTransaction && data.selectorName === 'NetworkHash' ? select(EntityType.CardanoTransaction, data.selector, {
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
	}) : select(EntityType.UtxoTransaction, data.selector, {
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
	}))
	const entityViewComponentByType = {
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
	<title>{data.entityType === EntityType.EvmTransaction && data.selectorName === 'EvmNetworkTxHash' ? (pageSelection.entity == null ? [String((data.selector.txHash) ?? '')].filter(Boolean).join(' ') || 'EVM transaction' : [String((({ ...data.selector, ...pageSelection.entity }).txHash) ?? '')].filter(Boolean).join(' ') || 'EVM transaction') : data.entityType === EntityType.SolanaTransaction && data.selectorName === 'NetworkSignature' ? (pageSelection.entity == null ? [String((data.selector.signature) ?? '')].filter(Boolean).join(' ') || 'solana transaction' : [String((({ ...data.selector, ...pageSelection.entity }).signature) ?? '')].filter(Boolean).join(' ') || 'solana transaction') : data.entityType === EntityType.CardanoTransaction && data.selectorName === 'NetworkHash' ? (pageSelection.entity == null ? [String((data.selector.hash) ?? '')].filter(Boolean).join(' ') || 'Cardano transaction' : [String((({ ...data.selector, ...pageSelection.entity }).hash) ?? '')].filter(Boolean).join(' ') || 'Cardano transaction') : (pageSelection.entity == null ? [String((data.selector.txId) ?? '')].filter(Boolean).join(' ') || 'UTXO transaction' : [String((({ ...data.selector, ...pageSelection.entity }).txId) ?? '')].filter(Boolean).join(' ') || 'UTXO transaction')} • {data.entityType === EntityType.EvmTransaction && data.selectorName === 'EvmNetworkTxHash' ? 'EVM transaction' : data.entityType === EntityType.SolanaTransaction && data.selectorName === 'NetworkSignature' ? 'solana transaction' : data.entityType === EntityType.CardanoTransaction && data.selectorName === 'NetworkHash' ? 'Cardano transaction' : 'UTXO transaction'} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewComponentByType[data.entityType]}

	<EntityView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
				network: params.network,
				transactionId: params.transactionId,
			})
		}
		selection={pageSelection}
	/>
</Page>
