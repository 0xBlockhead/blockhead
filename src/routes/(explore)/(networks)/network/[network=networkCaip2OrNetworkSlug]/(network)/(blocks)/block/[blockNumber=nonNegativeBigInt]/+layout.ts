// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import ArweaveBlockSchema from '$/schema/ArweaveBlock.ts'
import CosmosBlockSchema from '$/schema/CosmosBlock.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmBlockSchema from '$/schema/EvmBlock.ts'
import HederaBlockSchema from '$/schema/HederaBlock.ts'
import HyperliquidBlockSchema from '$/schema/HyperliquidBlock.ts'
import { schema } from '$/schema/index.ts'
import MoneroBlockSchema from '$/schema/MoneroBlock.ts'
import NearBlockSchema from '$/schema/NearBlock.ts'
import PolkadotBlockSchema from '$/schema/PolkadotBlock.ts'
import SolanaBlockSchema from '$/schema/SolanaBlock.ts'
import TronBlockSchema from '$/schema/TronBlock.ts'
import UtxoBlockSchema from '$/schema/UtxoBlock.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const routeCandidates: (
		| {
			readonly entityType: EntityType.EvmBlock
			readonly selectorName: 'EvmNetworkBlockNumber'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.EvmBlock,
				'EvmNetworkBlockNumber'
			>
		}
		| {
			readonly entityType: EntityType.SolanaBlock
			readonly selectorName: 'Slot'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.SolanaBlock,
				'Slot'
			>
		}
		| {
			readonly entityType: EntityType.UtxoBlock
			readonly selectorName: 'NetworkHeight'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.UtxoBlock,
				'NetworkHeight'
			>
		}
		| {
			readonly entityType: EntityType.PolkadotBlock
			readonly selectorName: 'NetworkBlockNumber'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.PolkadotBlock,
				'NetworkBlockNumber'
			>
		}
		| {
			readonly entityType: EntityType.ArweaveBlock
			readonly selectorName: 'NetworkHeight'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.ArweaveBlock,
				'NetworkHeight'
			>
		}
		| {
			readonly entityType: EntityType.CosmosBlock
			readonly selectorName: 'NetworkHeight'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.CosmosBlock,
				'NetworkHeight'
			>
		}
		| {
			readonly entityType: EntityType.HederaBlock
			readonly selectorName: 'NetworkBlockNumber'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.HederaBlock,
				'NetworkBlockNumber'
			>
		}
		| {
			readonly entityType: EntityType.HyperliquidBlock
			readonly selectorName: 'Height'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.HyperliquidBlock,
				'Height'
			>
		}
		| {
			readonly entityType: EntityType.MoneroBlock
			readonly selectorName: 'NetworkHeight'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.MoneroBlock,
				'NetworkHeight'
			>
		}
		| {
			readonly entityType: EntityType.NearBlock
			readonly selectorName: 'NetworkHeight'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.NearBlock,
				'NetworkHeight'
			>
		}
		| {
			readonly entityType: EntityType.TronBlock
			readonly selectorName: 'NetworkHeight'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.TronBlock,
				'NetworkHeight'
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
		&& matchNonNegativeBigInt(params.blockNumber)
	) {
		const evmBlockEvmNetworkBlockNumberSelector = parseEntitySelector(
			schema,
			EvmBlockSchema,
			{
				$network: parentData.selector,
				blockNumber: BigInt(params.blockNumber),
			},
			'EvmNetworkBlockNumber'
		)
		if (!(evmBlockEvmNetworkBlockNumberSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.EvmBlock,
				selectorName: 'EvmNetworkBlockNumber',
				selector: evmBlockEvmNetworkBlockNumberSelector,
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
		&& matchNonNegativeBigInt(params.blockNumber)
	) {
		const solanaBlockSlotSelector = parseEntitySelector(
			schema,
			SolanaBlockSchema,
			{
				$network: parentData.selector,
				slot: BigInt(params.blockNumber),
			},
			'Slot'
		)
		if (!(solanaBlockSlotSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.SolanaBlock,
				selectorName: 'Slot',
				selector: solanaBlockSlotSelector,
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
				'Cardano',
				'Dogecoin',
				'Elements',
				'Litecoin',
				'Zcash',
			].includes(parentData.projectionNetwork.namespace)
		)
		&& matchNonNegativeBigInt(params.blockNumber)
	) {
		const utxoBlockNetworkHeightSelector = parseEntitySelector(
			schema,
			UtxoBlockSchema,
			{
				$network: parentData.selector,
				height: BigInt(params.blockNumber),
			},
			'NetworkHeight'
		)
		if (!(utxoBlockNetworkHeightSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.UtxoBlock,
				selectorName: 'NetworkHeight',
				selector: utxoBlockNetworkHeightSelector,
			})
	}

	if (
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')
			)
			&& parentData.projectionNetwork.namespace === 'Polkadot'
		)
		&& matchNonNegativeBigInt(params.blockNumber)
	) {
		const polkadotBlockNetworkBlockNumberSelector = parseEntitySelector(
			schema,
			PolkadotBlockSchema,
			{
				$network: parentData.selector,
				blockNumber: BigInt(params.blockNumber),
			},
			'NetworkBlockNumber'
		)
		if (!(polkadotBlockNetworkBlockNumberSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.PolkadotBlock,
				selectorName: 'NetworkBlockNumber',
				selector: polkadotBlockNetworkBlockNumberSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Arweave' && matchNonNegativeBigInt(params.blockNumber)) {
		const arweaveBlockNetworkHeightSelector = parseEntitySelector(
			schema,
			ArweaveBlockSchema,
			{
				$network: {
					$network: parentData.selector,
				},
				height: BigInt(params.blockNumber),
			},
			'NetworkHeight'
		)
		if (!(arweaveBlockNetworkHeightSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.ArweaveBlock,
				selectorName: 'NetworkHeight',
				selector: arweaveBlockNetworkHeightSelector,
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
		&& matchNonNegativeBigInt(params.blockNumber)
	) {
		const cosmosBlockNetworkHeightSelector = parseEntitySelector(
			schema,
			CosmosBlockSchema,
			{
				$network: parentData.selector,
				height: BigInt(params.blockNumber),
			},
			'NetworkHeight'
		)
		if (!(cosmosBlockNetworkHeightSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.CosmosBlock,
				selectorName: 'NetworkHeight',
				selector: cosmosBlockNetworkHeightSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Hedera' && matchNonNegativeBigInt(params.blockNumber)) {
		const hederaBlockNetworkBlockNumberSelector = parseEntitySelector(
			schema,
			HederaBlockSchema,
			{
				$network: parentData.selector,
				blockNumber: BigInt(params.blockNumber),
			},
			'NetworkBlockNumber'
		)
		if (!(hederaBlockNetworkBlockNumberSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.HederaBlock,
				selectorName: 'NetworkBlockNumber',
				selector: hederaBlockNetworkBlockNumberSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Hyperliquid' && matchNonNegativeBigInt(params.blockNumber)) {
		const hyperliquidBlockHeightSelector = parseEntitySelector(
			schema,
			HyperliquidBlockSchema,
			{
				$network: parentData.selector,
				height: BigInt(params.blockNumber),
			},
			'Height'
		)
		if (!(hyperliquidBlockHeightSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.HyperliquidBlock,
				selectorName: 'Height',
				selector: hyperliquidBlockHeightSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Monero' && matchNonNegativeBigInt(params.blockNumber)) {
		const moneroBlockNetworkHeightSelector = parseEntitySelector(
			schema,
			MoneroBlockSchema,
			{
				$network: parentData.selector,
				height: BigInt(params.blockNumber),
			},
			'NetworkHeight'
		)
		if (!(moneroBlockNetworkHeightSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.MoneroBlock,
				selectorName: 'NetworkHeight',
				selector: moneroBlockNetworkHeightSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Near' && matchNonNegativeBigInt(params.blockNumber)) {
		const nearBlockNetworkHeightSelector = parseEntitySelector(
			schema,
			NearBlockSchema,
			{
				$network: parentData.selector,
				height: BigInt(params.blockNumber),
			},
			'NetworkHeight'
		)
		if (!(nearBlockNetworkHeightSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.NearBlock,
				selectorName: 'NetworkHeight',
				selector: nearBlockNetworkHeightSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Tron' && matchNonNegativeBigInt(params.blockNumber)) {
		const tronBlockNetworkHeightSelector = parseEntitySelector(
			schema,
			TronBlockSchema,
			{
				$network: parentData.selector,
				height: BigInt(params.blockNumber),
			},
			'NetworkHeight'
		)
		if (!(tronBlockNetworkHeightSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.TronBlock,
				selectorName: 'NetworkHeight',
				selector: tronBlockNetworkHeightSelector,
			})
	}

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
