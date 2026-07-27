// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
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

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

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

	if (((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')) && projectionNetwork.namespace === 'Evm') && matchEvmTxHash(params.transactionId)) {
		const evmTransactionEvmNetworkTxHashSelector = parseEntitySelector(
			schema,
			EvmTransactionSchema,
			{
				$network: parentData.selector,
				txHash: params.transactionId,
			}
		)
		if (!(evmTransactionEvmNetworkTxHashSelector instanceof arktype.errors) && '$network' in evmTransactionEvmNetworkTxHashSelector && 'txHash' in evmTransactionEvmNetworkTxHashSelector)
			routeCandidates.push({ entityType: EntityType.EvmTransaction, selectorName: 'EvmNetworkTxHash', selector: evmTransactionEvmNetworkTxHashSelector })
	}

	if (((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'SolanaRuntime')) && projectionNetwork.namespace === 'Solana') && matchSolanaSignature(params.transactionId)) {
		const solanaTransactionNetworkSignatureSelector = parseEntitySelector(
			schema,
			SolanaTransactionSchema,
			{
				$network: parentData.selector,
				signature: params.transactionId,
			}
		)
		if (!(solanaTransactionNetworkSignatureSelector instanceof arktype.errors) && '$network' in solanaTransactionNetworkSignatureSelector && 'signature' in solanaTransactionNetworkSignatureSelector)
			routeCandidates.push({ entityType: EntityType.SolanaTransaction, selectorName: 'NetworkSignature', selector: solanaTransactionNetworkSignatureSelector })
	}

	if (projectionNetwork.namespace === 'Cardano' && matchUtxoTxId(params.transactionId)) {
		const cardanoTransactionNetworkHashSelector = parseEntitySelector(
			schema,
			CardanoTransactionSchema,
			{
				$network: parentData.selector,
				hash: params.transactionId,
			}
		)
		if (!(cardanoTransactionNetworkHashSelector instanceof arktype.errors) && '$network' in cardanoTransactionNetworkHashSelector && 'hash' in cardanoTransactionNetworkHashSelector)
			routeCandidates.push({ entityType: EntityType.CardanoTransaction, selectorName: 'NetworkHash', selector: cardanoTransactionNetworkHashSelector })
	}

	if (((projectionNetwork.ledgerModels !== undefined && projectionNetwork.ledgerModels.some((value: string | number | boolean | null) => value === 'Utxo')) && [
	'Bitcoin',
	'BitcoinCash',
	'Dogecoin',
	'Elements',
	'Litecoin',
	'Zcash',
].includes(projectionNetwork.namespace)) && matchUtxoTxId(params.transactionId)) {
		const utxoTransactionNetworkTxIdSelector = parseEntitySelector(
			schema,
			UtxoTransactionSchema,
			{
				$network: parentData.selector,
				txId: params.transactionId,
			}
		)
		if (!(utxoTransactionNetworkTxIdSelector instanceof arktype.errors) && '$network' in utxoTransactionNetworkTxIdSelector && 'txId' in utxoTransactionNetworkTxIdSelector)
			routeCandidates.push({ entityType: EntityType.UtxoTransaction, selectorName: 'NetworkTxId', selector: utxoTransactionNetworkTxIdSelector })
	}

	if (routeCandidates.length === 0) error(404, 'Route selector not applicable')
	if (routeCandidates.length > 1) error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
