// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmTxHash } from '$/params/evmTxHash.ts'
import { match as matchSolanaSignature } from '$/params/solanaSignature.ts'
import { match as matchUtxoTxId } from '$/params/utxoTxId.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import CardanoTransactionSchema from '$/schema/CardanoTransaction.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmTransactionSchema from '$/schema/EvmTransaction.ts'
import { schema } from '$/schema/index.ts'
import SolanaTransactionSchema from '$/schema/SolanaTransaction.ts'
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

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
