// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
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

	const evmBlockEvmNetworkBlockNumberSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
				)
				&& parentData.projectionNetwork.namespace === 'Evm'
			)
			&& matchNonNegativeBigInt(params.blockNumber)
		))
			return

		const evmBlockEvmNetworkBlockNumberSelector = parseRouteEntitySelector(
			schema,
			EvmBlockSchema,
			{
				$network: parentData.selector,
				blockNumber: BigInt(params.blockNumber),
			},
			'EvmNetworkBlockNumber'
		)
		if ((!(evmBlockEvmNetworkBlockNumberSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.EvmBlock,
				selectorName: 'EvmNetworkBlockNumber',
				selector: evmBlockEvmNetworkBlockNumberSelector,
			} as const
	})()

	const solanaBlockSlotSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'SolanaRuntime')
				)
				&& parentData.projectionNetwork.namespace === 'Solana'
			)
			&& matchNonNegativeBigInt(params.blockNumber)
		))
			return

		const solanaBlockSlotSelector = parseRouteEntitySelector(
			schema,
			SolanaBlockSchema,
			{
				$network: parentData.selector,
				slot: BigInt(params.blockNumber),
			},
			'Slot'
		)
		if ((!(solanaBlockSlotSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.SolanaBlock,
				selectorName: 'Slot',
				selector: solanaBlockSlotSelector,
			} as const
	})()

	const utxoBlockNetworkHeightSelectorCandidate = (() => {
		if (!(
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
		))
			return

		const utxoBlockNetworkHeightSelector = parseRouteEntitySelector(
			schema,
			UtxoBlockSchema,
			{
				$network: parentData.selector,
				height: BigInt(params.blockNumber),
			},
			'NetworkHeight'
		)
		if ((!(utxoBlockNetworkHeightSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.UtxoBlock,
				selectorName: 'NetworkHeight',
				selector: utxoBlockNetworkHeightSelector,
			} as const
	})()

	const polkadotBlockNetworkBlockNumberSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')
				)
				&& parentData.projectionNetwork.namespace === 'Polkadot'
			)
			&& matchNonNegativeBigInt(params.blockNumber)
		))
			return

		const polkadotBlockNetworkBlockNumberSelector = parseRouteEntitySelector(
			schema,
			PolkadotBlockSchema,
			{
				$network: parentData.selector,
				blockNumber: BigInt(params.blockNumber),
			},
			'NetworkBlockNumber'
		)
		if ((!(polkadotBlockNetworkBlockNumberSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.PolkadotBlock,
				selectorName: 'NetworkBlockNumber',
				selector: polkadotBlockNetworkBlockNumberSelector,
			} as const
	})()

	const arweaveBlockNetworkHeightSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Arweave' && matchNonNegativeBigInt(params.blockNumber)))
			return

		const arweaveBlockNetworkHeightSelector = parseRouteEntitySelector(
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
		if ((!(arweaveBlockNetworkHeightSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.ArweaveBlock,
				selectorName: 'NetworkHeight',
				selector: arweaveBlockNetworkHeightSelector,
			} as const
	})()

	const cosmosBlockNetworkHeightSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'CosmosSdk')
				)
				&& parentData.projectionNetwork.namespace === 'Cosmos'
			)
			&& matchNonNegativeBigInt(params.blockNumber)
		))
			return

		const cosmosBlockNetworkHeightSelector = parseRouteEntitySelector(
			schema,
			CosmosBlockSchema,
			{
				$network: parentData.selector,
				height: BigInt(params.blockNumber),
			},
			'NetworkHeight'
		)
		if ((!(cosmosBlockNetworkHeightSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.CosmosBlock,
				selectorName: 'NetworkHeight',
				selector: cosmosBlockNetworkHeightSelector,
			} as const
	})()

	const hederaBlockNetworkBlockNumberSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Hedera' && matchNonNegativeBigInt(params.blockNumber)))
			return

		const hederaBlockNetworkBlockNumberSelector = parseRouteEntitySelector(
			schema,
			HederaBlockSchema,
			{
				$network: parentData.selector,
				blockNumber: BigInt(params.blockNumber),
			},
			'NetworkBlockNumber'
		)
		if ((!(hederaBlockNetworkBlockNumberSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.HederaBlock,
				selectorName: 'NetworkBlockNumber',
				selector: hederaBlockNetworkBlockNumberSelector,
			} as const
	})()

	const hyperliquidBlockHeightSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Hyperliquid' && matchNonNegativeBigInt(params.blockNumber)))
			return

		const hyperliquidBlockHeightSelector = parseRouteEntitySelector(
			schema,
			HyperliquidBlockSchema,
			{
				$network: parentData.selector,
				height: BigInt(params.blockNumber),
			},
			'Height'
		)
		if ((!(hyperliquidBlockHeightSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.HyperliquidBlock,
				selectorName: 'Height',
				selector: hyperliquidBlockHeightSelector,
			} as const
	})()

	const moneroBlockNetworkHeightSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Monero' && matchNonNegativeBigInt(params.blockNumber)))
			return

		const moneroBlockNetworkHeightSelector = parseRouteEntitySelector(
			schema,
			MoneroBlockSchema,
			{
				$network: parentData.selector,
				height: BigInt(params.blockNumber),
			},
			'NetworkHeight'
		)
		if ((!(moneroBlockNetworkHeightSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.MoneroBlock,
				selectorName: 'NetworkHeight',
				selector: moneroBlockNetworkHeightSelector,
			} as const
	})()

	const nearBlockNetworkHeightSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Near' && matchNonNegativeBigInt(params.blockNumber)))
			return

		const nearBlockNetworkHeightSelector = parseRouteEntitySelector(
			schema,
			NearBlockSchema,
			{
				$network: parentData.selector,
				height: BigInt(params.blockNumber),
			},
			'NetworkHeight'
		)
		if ((!(nearBlockNetworkHeightSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.NearBlock,
				selectorName: 'NetworkHeight',
				selector: nearBlockNetworkHeightSelector,
			} as const
	})()

	const tronBlockNetworkHeightSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Tron' && matchNonNegativeBigInt(params.blockNumber)))
			return

		const tronBlockNetworkHeightSelector = parseRouteEntitySelector(
			schema,
			TronBlockSchema,
			{
				$network: parentData.selector,
				height: BigInt(params.blockNumber),
			},
			'NetworkHeight'
		)
		if ((!(tronBlockNetworkHeightSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.TronBlock,
				selectorName: 'NetworkHeight',
				selector: tronBlockNetworkHeightSelector,
			} as const
	})()

	const routeCandidates = [
		evmBlockEvmNetworkBlockNumberSelectorCandidate,
		solanaBlockSlotSelectorCandidate,
		utxoBlockNetworkHeightSelectorCandidate,
		polkadotBlockNetworkBlockNumberSelectorCandidate,
		arweaveBlockNetworkHeightSelectorCandidate,
		cosmosBlockNetworkHeightSelectorCandidate,
		hederaBlockNetworkBlockNumberSelectorCandidate,
		hyperliquidBlockHeightSelectorCandidate,
		moneroBlockNetworkHeightSelectorCandidate,
		nearBlockNetworkHeightSelectorCandidate,
		tronBlockNetworkHeightSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
