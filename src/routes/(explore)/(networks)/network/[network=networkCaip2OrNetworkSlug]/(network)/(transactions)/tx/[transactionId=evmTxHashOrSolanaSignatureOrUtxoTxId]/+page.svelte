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

	const pageSelection = $derived(data.selectorMapping.entityType === EntityType.EvmTransaction && data.selectorMapping.selectorName === 'EvmNetworkTxHash' ? select(EntityType.EvmTransaction, data.selectorMapping.selector, {
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
	}) : data.selectorMapping.entityType === EntityType.SolanaTransaction && data.selectorMapping.selectorName === 'NetworkSignature' ? select(EntityType.SolanaTransaction, data.selectorMapping.selector, {
		fields: {
			status: true,
			slot: true,
			feeLamports: true,
			computeUnitsConsumed: true,
			$block: true,
			$feePayer: true,
		},
	}) : data.selectorMapping.entityType === EntityType.UtxoTransaction && data.selectorMapping.selectorName === 'NetworkTxId' ? select(EntityType.UtxoTransaction, data.selectorMapping.selector, {
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
	}) : undefined)
	const pageEntityTitle = $derived(data.selectorMapping.entityType === EntityType.EvmTransaction && data.selectorMapping.selectorName === 'EvmNetworkTxHash' ? (pageSelection.entity == null ? [String((pageSelection.entitySelector.txHash) ?? '')].filter(Boolean).join(' ') || 'EVM transaction' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).txHash) ?? '')].filter(Boolean).join(' ') || 'EVM transaction') : data.selectorMapping.entityType === EntityType.SolanaTransaction && data.selectorMapping.selectorName === 'NetworkSignature' ? (pageSelection.entity == null ? [String((pageSelection.entitySelector.signature) ?? '')].filter(Boolean).join(' ') || 'solana transaction' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).signature) ?? '')].filter(Boolean).join(' ') || 'solana transaction') : data.selectorMapping.entityType === EntityType.UtxoTransaction && data.selectorMapping.selectorName === 'NetworkTxId' ? (pageSelection.entity == null ? [String((pageSelection.entitySelector.txId) ?? '')].filter(Boolean).join(' ') || 'UTXO transaction' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).txId) ?? '')].filter(Boolean).join(' ') || 'UTXO transaction') : 'Blockhead')
	const pageEntityTypeLabel = $derived(data.selectorMapping.entityType === EntityType.EvmTransaction && data.selectorMapping.selectorName === 'EvmNetworkTxHash' ? 'EVM transaction' : data.selectorMapping.entityType === EntityType.SolanaTransaction && data.selectorMapping.selectorName === 'NetworkSignature' ? 'solana transaction' : data.selectorMapping.entityType === EntityType.UtxoTransaction && data.selectorMapping.selectorName === 'NetworkTxId' ? 'UTXO transaction' : 'Entity')

	// Components
	import Page from '$/components/Page.svelte'
	import { entityViewComponentByType } from '$/views/index.ts'
</script>


<svelte:head>
	<title>{pageEntityTitle} • {pageEntityTypeLabel} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewComponentByType[data.selectorMapping.entityType]}

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
