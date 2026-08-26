// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmTxHash } from '$/params/evmTxHash.ts'
import { match as matchSolanaSignature } from '$/params/solanaSignature.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { match as matchUtxoTxId } from '$/params/utxoTxId.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
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

	const evmTransactionEvmNetworkTxHashSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
				)
				&& parentData.projectionNetwork.namespace === 'Evm'
			)
			&& matchEvmTxHash(params.transactionId)
		))
			return

		const evmTransactionEvmNetworkTxHashSelector = parseRouteEntitySelector(
			schema,
			EvmTransactionSchema,
			{
				$network: parentData.selector,
				txHash: params.transactionId,
			},
			'EvmNetworkTxHash'
		)
		if ((!(evmTransactionEvmNetworkTxHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.EvmTransaction,
				selectorName: 'EvmNetworkTxHash',
				selector: evmTransactionEvmNetworkTxHashSelector,
			} as const
	})()

	const solanaTransactionNetworkSignatureSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'SolanaRuntime')
				)
				&& parentData.projectionNetwork.namespace === 'Solana'
			)
			&& matchSolanaSignature(params.transactionId)
		))
			return

		const solanaTransactionNetworkSignatureSelector = parseRouteEntitySelector(
			schema,
			SolanaTransactionSchema,
			{
				$network: parentData.selector,
				signature: params.transactionId,
			},
			'NetworkSignature'
		)
		if ((!(solanaTransactionNetworkSignatureSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.SolanaTransaction,
				selectorName: 'NetworkSignature',
				selector: solanaTransactionNetworkSignatureSelector,
			} as const
	})()

	const cardanoTransactionNetworkHashSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Cardano' && matchUtxoTxId(params.transactionId)))
			return

		const cardanoTransactionNetworkHashSelector = parseRouteEntitySelector(
			schema,
			CardanoTransactionSchema,
			{
				$network: parentData.selector,
				hash: params.transactionId,
			},
			'NetworkHash'
		)
		if ((!(cardanoTransactionNetworkHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.CardanoTransaction,
				selectorName: 'NetworkHash',
				selector: cardanoTransactionNetworkHashSelector,
			} as const
	})()

	const utxoTransactionNetworkTxIdSelectorCandidate = (() => {
		if (!(
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
		))
			return

		const utxoTransactionNetworkTxIdSelector = parseRouteEntitySelector(
			schema,
			UtxoTransactionSchema,
			{
				$network: parentData.selector,
				txId: params.transactionId,
			},
			'NetworkTxId'
		)
		if ((!(utxoTransactionNetworkTxIdSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.UtxoTransaction,
				selectorName: 'NetworkTxId',
				selector: utxoTransactionNetworkTxIdSelector,
			} as const
	})()

	const arweaveTransactionNetworkTransactionIdSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Arweave' && matchStringSegment(params.transactionId)))
			return

		const arweaveTransactionNetworkTransactionIdSelector = parseRouteEntitySelector(
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
		if ((!(arweaveTransactionNetworkTransactionIdSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.ArweaveTransaction,
				selectorName: 'NetworkTransactionId',
				selector: arweaveTransactionNetworkTransactionIdSelector,
			} as const
	})()

	const cosmosTransactionNetworkTxHashSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'CosmosSdk')
				)
				&& parentData.projectionNetwork.namespace === 'Cosmos'
			)
			&& matchStringSegment(params.transactionId)
		))
			return

		const cosmosTransactionNetworkTxHashSelector = parseRouteEntitySelector(
			schema,
			CosmosTransactionSchema,
			{
				$network: parentData.selector,
				txHash: params.transactionId,
			},
			'NetworkTxHash'
		)
		if ((!(cosmosTransactionNetworkTxHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.CosmosTransaction,
				selectorName: 'NetworkTxHash',
				selector: cosmosTransactionNetworkTxHashSelector,
			} as const
	})()

	const hyperliquidTransactionNetworkTxHashSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Hyperliquid'
			&& (
				matchEvmTxHash(params.transactionId)
				|| matchSolanaSignature(params.transactionId)
				|| matchUtxoTxId(params.transactionId)
				|| matchStringSegment(params.transactionId)
			)
		))
			return

		const hyperliquidTransactionNetworkTxHashSelector = parseRouteEntitySelector(
			schema,
			HyperliquidTransactionSchema,
			{
				$network: parentData.selector,
				txHash: params.transactionId,
			},
			'NetworkTxHash'
		)
		if ((!(hyperliquidTransactionNetworkTxHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.HyperliquidTransaction,
				selectorName: 'NetworkTxHash',
				selector: hyperliquidTransactionNetworkTxHashSelector,
			} as const
	})()

	const moneroTransactionNetworkTxHashSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Monero' && matchStringSegment(params.transactionId)))
			return

		const moneroTransactionNetworkTxHashSelector = parseRouteEntitySelector(
			schema,
			MoneroTransactionSchema,
			{
				$network: parentData.selector,
				txHash: params.transactionId,
			},
			'NetworkTxHash'
		)
		if ((!(moneroTransactionNetworkTxHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.MoneroTransaction,
				selectorName: 'NetworkTxHash',
				selector: moneroTransactionNetworkTxHashSelector,
			} as const
	})()

	const nearTransactionNetworkHashSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Near' && matchStringSegment(params.transactionId)))
			return

		const nearTransactionNetworkHashSelector = parseRouteEntitySelector(
			schema,
			NearTransactionSchema,
			{
				$network: parentData.selector,
				hash: params.transactionId,
			},
			'NetworkHash'
		)
		if ((!(nearTransactionNetworkHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.NearTransaction,
				selectorName: 'NetworkHash',
				selector: nearTransactionNetworkHashSelector,
			} as const
	})()

	const tronTransactionNetworkTransactionIdSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Tron' && matchStringSegment(params.transactionId)))
			return

		const tronTransactionNetworkTransactionIdSelector = parseRouteEntitySelector(
			schema,
			TronTransactionSchema,
			{
				$network: parentData.selector,
				transactionId: params.transactionId,
			},
			'NetworkTransactionId'
		)
		if ((!(tronTransactionNetworkTransactionIdSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.TronTransaction,
				selectorName: 'NetworkTransactionId',
				selector: tronTransactionNetworkTransactionIdSelector,
			} as const
	})()

	const aptosTransactionNetworkHashSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Aptos' && matchStringSegment(params.transactionId)))
			return

		const aptosTransactionNetworkHashSelector = parseRouteEntitySelector(
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
		if ((!(aptosTransactionNetworkHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.AptosTransaction,
				selectorName: 'NetworkHash',
				selector: aptosTransactionNetworkHashSelector,
			} as const
	})()

	const routeCandidates = [
		evmTransactionEvmNetworkTxHashSelectorCandidate,
		solanaTransactionNetworkSignatureSelectorCandidate,
		cardanoTransactionNetworkHashSelectorCandidate,
		utxoTransactionNetworkTxIdSelectorCandidate,
		arweaveTransactionNetworkTransactionIdSelectorCandidate,
		cosmosTransactionNetworkTxHashSelectorCandidate,
		hyperliquidTransactionNetworkTxHashSelectorCandidate,
		moneroTransactionNetworkTxHashSelectorCandidate,
		nearTransactionNetworkHashSelectorCandidate,
		tronTransactionNetworkTransactionIdSelectorCandidate,
		aptosTransactionNetworkHashSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
