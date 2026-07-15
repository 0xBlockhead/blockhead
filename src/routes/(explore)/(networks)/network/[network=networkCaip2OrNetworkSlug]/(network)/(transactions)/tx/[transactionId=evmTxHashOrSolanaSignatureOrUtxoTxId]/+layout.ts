// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchEvmTxHash } from '$/params/evmTxHash.ts'
import { match as matchSolanaSignature } from '$/params/solanaSignature.ts'
import { match as matchUtxoTxId } from '$/params/utxoTxId.ts'
import { parseEntitySelector, type EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmTransaction as EvmTransactionSchema } from '$/schema/EvmTransaction.ts'
import { schema } from '$/schema/index.ts'
import { SolanaTransaction as SolanaTransactionSchema } from '$/schema/SolanaTransaction.ts'
import { UtxoTransaction as UtxoTransactionSchema } from '$/schema/UtxoTransaction.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	const selectorMappings: {
		entityType: EntityType
		selectorName: string
		selector: EntitySelector<typeof schema, EntityType>
	}[] = []

	if ((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')) && matchEvmTxHash(params.transactionId)) {
		const evmTransactionEvmNetworkTxHashSelector = parseEntitySelector(
			schema,
			EvmTransactionSchema,
			{
				$network: parentData.selector,
				txHash: params.transactionId,
			}
		)
		if (!(evmTransactionEvmNetworkTxHashSelector instanceof arktype.errors))
			selectorMappings.push({ entityType: EntityType.EvmTransaction, selectorName: 'EvmNetworkTxHash', selector: evmTransactionEvmNetworkTxHashSelector })
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
		if (!(solanaTransactionNetworkSignatureSelector instanceof arktype.errors))
			selectorMappings.push({ entityType: EntityType.SolanaTransaction, selectorName: 'NetworkSignature', selector: solanaTransactionNetworkSignatureSelector })
	}

	if (((projectionNetwork.ledgerModels !== undefined && projectionNetwork.ledgerModels.some((value: string | number | boolean | null) => value === 'Utxo')) && [
	'Bitcoin',
	'BitcoinCash',
	'Cardano',
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
		if (!(utxoTransactionNetworkTxIdSelector instanceof arktype.errors))
			selectorMappings.push({ entityType: EntityType.UtxoTransaction, selectorName: 'NetworkTxId', selector: utxoTransactionNetworkTxIdSelector })
	}

	if (selectorMappings.length === 0) error(404, 'Route selector not applicable')
	if (selectorMappings.length > 1) error(500, 'Route selector is ambiguous')
	const selectorMapping = selectorMappings[0]

	return { selector: selectorMapping.selector, selectorMapping, selectorMappings }
}
