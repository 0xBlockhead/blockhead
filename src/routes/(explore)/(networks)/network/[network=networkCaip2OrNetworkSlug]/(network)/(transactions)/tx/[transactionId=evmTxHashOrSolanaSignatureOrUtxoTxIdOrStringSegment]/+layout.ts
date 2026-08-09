// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmTxHash } from '$/params/evmTxHash.ts'
import { match as matchSolanaSignature } from '$/params/solanaSignature.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { match as matchUtxoTxId } from '$/params/utxoTxId.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import AptosTransactionSchema from '$/schema/AptosTransaction.ts'
import ArweaveTransactionSchema from '$/schema/ArweaveTransaction.ts'
import CardanoTransactionSchema from '$/schema/CardanoTransaction.ts'
import CosmosTransactionSchema from '$/schema/CosmosTransaction.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmTransactionSchema from '$/schema/EvmTransaction.ts'
import HyperliquidTransactionSchema from '$/schema/HyperliquidTransaction.ts'
import { schema } from '$/schema/index.ts'
import MoneroTransactionSchema from '$/schema/MoneroTransaction.ts'
import NearTransactionSchema from '$/schema/NearTransaction.ts'
import SolanaTransactionSchema from '$/schema/SolanaTransaction.ts'
import TronTransactionSchema from '$/schema/TronTransaction.ts'
import UtxoTransactionSchema from '$/schema/UtxoTransaction.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const routeCandidates: (
		| {
			readonly entityType: EntityType.EvmTransaction
			readonly selectorName: 'EvmNetworkTxHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.EvmTransaction,
				'EvmNetworkTxHash'
			>
		}
		| {
			readonly entityType: EntityType.SolanaTransaction
			readonly selectorName: 'NetworkSignature'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.SolanaTransaction,
				'NetworkSignature'
			>
		}
		| {
			readonly entityType: EntityType.CardanoTransaction
			readonly selectorName: 'NetworkHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.CardanoTransaction,
				'NetworkHash'
			>
		}
		| {
			readonly entityType: EntityType.UtxoTransaction
			readonly selectorName: 'NetworkTxId'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.UtxoTransaction,
				'NetworkTxId'
			>
		}
		| {
			readonly entityType: EntityType.ArweaveTransaction
			readonly selectorName: 'NetworkTransactionId'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.ArweaveTransaction,
				'NetworkTransactionId'
			>
		}
		| {
			readonly entityType: EntityType.CosmosTransaction
			readonly selectorName: 'NetworkTxHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.CosmosTransaction,
				'NetworkTxHash'
			>
		}
		| {
			readonly entityType: EntityType.HyperliquidTransaction
			readonly selectorName: 'NetworkTxHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.HyperliquidTransaction,
				'NetworkTxHash'
			>
		}
		| {
			readonly entityType: EntityType.MoneroTransaction
			readonly selectorName: 'NetworkTxHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.MoneroTransaction,
				'NetworkTxHash'
			>
		}
		| {
			readonly entityType: EntityType.NearTransaction
			readonly selectorName: 'NetworkHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.NearTransaction,
				'NetworkHash'
			>
		}
		| {
			readonly entityType: EntityType.TronTransaction
			readonly selectorName: 'NetworkTransactionId'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.TronTransaction,
				'NetworkTransactionId'
			>
		}
		| {
			readonly entityType: EntityType.AptosTransaction
			readonly selectorName: 'NetworkHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.AptosTransaction,
				'NetworkHash'
			>
		}
	)[] = []

	if (
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
			)
			&& parentData.projectionNetwork.namespace === 'Evm'
		)
		&& matchEvmTxHash(params.transactionId)
	) {
		const evmTransactionEvmNetworkTxHashSelector = parseEntitySelector(
			schema,
			EvmTransactionSchema,
			{
				$network: parentData.selector,
				txHash: params.transactionId,
			},
			'EvmNetworkTxHash'
		)
		if (!(evmTransactionEvmNetworkTxHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.EvmTransaction,
				selectorName: 'EvmNetworkTxHash',
				selector: evmTransactionEvmNetworkTxHashSelector,
			})
	}

	if (
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'SolanaRuntime')
			)
			&& parentData.projectionNetwork.namespace === 'Solana'
		)
		&& matchSolanaSignature(params.transactionId)
	) {
		const solanaTransactionNetworkSignatureSelector = parseEntitySelector(
			schema,
			SolanaTransactionSchema,
			{
				$network: parentData.selector,
				signature: params.transactionId,
			},
			'NetworkSignature'
		)
		if (!(solanaTransactionNetworkSignatureSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.SolanaTransaction,
				selectorName: 'NetworkSignature',
				selector: solanaTransactionNetworkSignatureSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Cardano' && matchUtxoTxId(params.transactionId)) {
		const cardanoTransactionNetworkHashSelector = parseEntitySelector(
			schema,
			CardanoTransactionSchema,
			{
				$network: parentData.selector,
				hash: params.transactionId,
			},
			'NetworkHash'
		)
		if (!(cardanoTransactionNetworkHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.CardanoTransaction,
				selectorName: 'NetworkHash',
				selector: cardanoTransactionNetworkHashSelector,
			})
	}

	if (
		(
			(
				parentData.projectionNetwork.ledgerModels !== undefined
				&& parentData.projectionNetwork.ledgerModels.some((value: string | number | boolean | null) => value === 'Utxo')
			)
			&& [
				'Bitcoin',
				'BitcoinCash',
				'Dogecoin',
				'Elements',
				'Litecoin',
				'Zcash',
			].includes(parentData.projectionNetwork.namespace)
		)
		&& matchUtxoTxId(params.transactionId)
	) {
		const utxoTransactionNetworkTxIdSelector = parseEntitySelector(
			schema,
			UtxoTransactionSchema,
			{
				$network: parentData.selector,
				txId: params.transactionId,
			},
			'NetworkTxId'
		)
		if (!(utxoTransactionNetworkTxIdSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.UtxoTransaction,
				selectorName: 'NetworkTxId',
				selector: utxoTransactionNetworkTxIdSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Arweave' && matchStringSegment(params.transactionId)) {
		const arweaveTransactionNetworkTransactionIdSelector = parseEntitySelector(
			schema,
			ArweaveTransactionSchema,
			{
				$network: {
					$network: parentData.selector,
				},
				transactionId: params.transactionId,
			},
			'NetworkTransactionId'
		)
		if (!(arweaveTransactionNetworkTransactionIdSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.ArweaveTransaction,
				selectorName: 'NetworkTransactionId',
				selector: arweaveTransactionNetworkTransactionIdSelector,
			})
	}

	if (
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'CosmosSdk')
			)
			&& parentData.projectionNetwork.namespace === 'Cosmos'
		)
		&& matchStringSegment(params.transactionId)
	) {
		const cosmosTransactionNetworkTxHashSelector = parseEntitySelector(
			schema,
			CosmosTransactionSchema,
			{
				$network: parentData.selector,
				txHash: params.transactionId,
			},
			'NetworkTxHash'
		)
		if (!(cosmosTransactionNetworkTxHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.CosmosTransaction,
				selectorName: 'NetworkTxHash',
				selector: cosmosTransactionNetworkTxHashSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Hyperliquid'
		&& (
			matchEvmTxHash(params.transactionId)
			|| matchSolanaSignature(params.transactionId)
			|| matchUtxoTxId(params.transactionId)
			|| matchStringSegment(params.transactionId)
		)
	) {
		const hyperliquidTransactionNetworkTxHashSelector = parseEntitySelector(
			schema,
			HyperliquidTransactionSchema,
			{
				$network: parentData.selector,
				txHash: params.transactionId,
			},
			'NetworkTxHash'
		)
		if (!(hyperliquidTransactionNetworkTxHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.HyperliquidTransaction,
				selectorName: 'NetworkTxHash',
				selector: hyperliquidTransactionNetworkTxHashSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Monero' && matchStringSegment(params.transactionId)) {
		const moneroTransactionNetworkTxHashSelector = parseEntitySelector(
			schema,
			MoneroTransactionSchema,
			{
				$network: parentData.selector,
				txHash: params.transactionId,
			},
			'NetworkTxHash'
		)
		if (!(moneroTransactionNetworkTxHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.MoneroTransaction,
				selectorName: 'NetworkTxHash',
				selector: moneroTransactionNetworkTxHashSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Near' && matchStringSegment(params.transactionId)) {
		const nearTransactionNetworkHashSelector = parseEntitySelector(
			schema,
			NearTransactionSchema,
			{
				$network: parentData.selector,
				hash: params.transactionId,
			},
			'NetworkHash'
		)
		if (!(nearTransactionNetworkHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.NearTransaction,
				selectorName: 'NetworkHash',
				selector: nearTransactionNetworkHashSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Tron' && matchStringSegment(params.transactionId)) {
		const tronTransactionNetworkTransactionIdSelector = parseEntitySelector(
			schema,
			TronTransactionSchema,
			{
				$network: parentData.selector,
				transactionId: params.transactionId,
			},
			'NetworkTransactionId'
		)
		if (!(tronTransactionNetworkTransactionIdSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.TronTransaction,
				selectorName: 'NetworkTransactionId',
				selector: tronTransactionNetworkTransactionIdSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Aptos' && matchStringSegment(params.transactionId)) {
		const aptosTransactionNetworkHashSelector = parseEntitySelector(
			schema,
			AptosTransactionSchema,
			{
				$network: {
					$network: parentData.selector,
				},
				hash: params.transactionId,
			},
			'NetworkHash'
		)
		if (!(aptosTransactionNetworkHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.AptosTransaction,
				selectorName: 'NetworkHash',
				selector: aptosTransactionNetworkHashSelector,
			})
	}

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
