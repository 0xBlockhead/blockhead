// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { match as matchUtxoTxId } from '$/params/utxoTxId.ts'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import ArweaveBlockSchema from '$/schema/ArweaveBlock.ts'
import CardanoBlockSchema from '$/schema/CardanoBlock.ts'
import CosmosBlockSchema from '$/schema/CosmosBlock.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmBlockSchema from '$/schema/EvmBlock.ts'
import HederaBlockSchema from '$/schema/HederaBlock.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const evmBlockEvmNetworkBlockHashSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
				)
				&& parentData.projectionNetwork.namespace === 'Evm'
			)
			&& matchZeroExHex(params.blockHash)
		))
			return

		const evmBlockEvmNetworkBlockHashSelector = parseRouteEntitySelector(
			schema,
			EvmBlockSchema,
			{
				$network: parentData.selector,
				hash: params.blockHash,
			},
			'EvmNetworkBlockHash'
		)
		if ((!(evmBlockEvmNetworkBlockHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.EvmBlock,
				selectorName: 'EvmNetworkBlockHash',
				selector: evmBlockEvmNetworkBlockHashSelector,
			} as const
	})()

	const arweaveBlockNetworkIndepHashSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Arweave' && matchStringSegment(params.blockHash)))
			return

		const arweaveBlockNetworkIndepHashSelector = parseRouteEntitySelector(
			schema,
			ArweaveBlockSchema,
			{
				$network: {
					$network: parentData.selector,
				},
				indepHash: params.blockHash,
			},
			'NetworkIndepHash'
		)
		if ((!(arweaveBlockNetworkIndepHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.ArweaveBlock,
				selectorName: 'NetworkIndepHash',
				selector: arweaveBlockNetworkIndepHashSelector,
			} as const
	})()

	const cardanoBlockNetworkHashSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Cardano' && matchUtxoTxId(params.blockHash)))
			return

		const cardanoBlockNetworkHashSelector = parseRouteEntitySelector(
			schema,
			CardanoBlockSchema,
			{
				$network: parentData.selector,
				hash: params.blockHash,
			},
			'NetworkHash'
		)
		if ((!(cardanoBlockNetworkHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.CardanoBlock,
				selectorName: 'NetworkHash',
				selector: cardanoBlockNetworkHashSelector,
			} as const
	})()

	const cosmosBlockNetworkHashSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'CosmosSdk')
				)
				&& parentData.projectionNetwork.namespace === 'Cosmos'
			)
			&& matchStringSegment(params.blockHash)
		))
			return

		const cosmosBlockNetworkHashSelector = parseRouteEntitySelector(
			schema,
			CosmosBlockSchema,
			{
				$network: parentData.selector,
				hash: params.blockHash,
			},
			'NetworkHash'
		)
		if ((!(cosmosBlockNetworkHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.CosmosBlock,
				selectorName: 'NetworkHash',
				selector: cosmosBlockNetworkHashSelector,
			} as const
	})()

	const hederaBlockNetworkBlockHashSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Hedera' && matchStringSegment(params.blockHash)))
			return

		const hederaBlockNetworkBlockHashSelector = parseRouteEntitySelector(
			schema,
			HederaBlockSchema,
			{
				$network: parentData.selector,
				blockHash: params.blockHash,
			},
			'NetworkBlockHash'
		)
		if ((!(hederaBlockNetworkBlockHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.HederaBlock,
				selectorName: 'NetworkBlockHash',
				selector: hederaBlockNetworkBlockHashSelector,
			} as const
	})()

	const routeCandidates = [
		evmBlockEvmNetworkBlockHashSelectorCandidate,
		arweaveBlockNetworkIndepHashSelectorCandidate,
		cardanoBlockNetworkHashSelectorCandidate,
		cosmosBlockNetworkHashSelectorCandidate,
		hederaBlockNetworkBlockHashSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
