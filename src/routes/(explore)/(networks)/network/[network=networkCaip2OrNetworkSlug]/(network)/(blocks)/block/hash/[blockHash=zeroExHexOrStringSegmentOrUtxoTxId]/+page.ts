// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { match as matchUtxoTxId } from '$/params/utxoTxId.ts'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
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

	const routeCandidates: (
		| {
			readonly entityType: EntityType.EvmBlock
			readonly selectorName: 'EvmNetworkBlockHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.EvmBlock,
				'EvmNetworkBlockHash'
			>
		}
		| {
			readonly entityType: EntityType.ArweaveBlock
			readonly selectorName: 'NetworkIndepHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.ArweaveBlock,
				'NetworkIndepHash'
			>
		}
		| {
			readonly entityType: EntityType.CardanoBlock
			readonly selectorName: 'NetworkHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.CardanoBlock,
				'NetworkHash'
			>
		}
		| {
			readonly entityType: EntityType.CosmosBlock
			readonly selectorName: 'NetworkHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.CosmosBlock,
				'NetworkHash'
			>
		}
		| {
			readonly entityType: EntityType.HederaBlock
			readonly selectorName: 'NetworkBlockHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.HederaBlock,
				'NetworkBlockHash'
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
		&& matchZeroExHex(params.blockHash)
	) {
		const evmBlockEvmNetworkBlockHashSelector = parseEntitySelector(
			schema,
			EvmBlockSchema,
			{
				$network: parentData.selector,
				hash: params.blockHash,
			},
			'EvmNetworkBlockHash'
		)
		if (!(evmBlockEvmNetworkBlockHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.EvmBlock,
				selectorName: 'EvmNetworkBlockHash',
				selector: evmBlockEvmNetworkBlockHashSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Arweave' && matchStringSegment(params.blockHash)) {
		const arweaveBlockNetworkIndepHashSelector = parseEntitySelector(
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
		if (!(arweaveBlockNetworkIndepHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.ArweaveBlock,
				selectorName: 'NetworkIndepHash',
				selector: arweaveBlockNetworkIndepHashSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Cardano' && matchUtxoTxId(params.blockHash)) {
		const cardanoBlockNetworkHashSelector = parseEntitySelector(
			schema,
			CardanoBlockSchema,
			{
				$network: parentData.selector,
				hash: params.blockHash,
			},
			'NetworkHash'
		)
		if (!(cardanoBlockNetworkHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.CardanoBlock,
				selectorName: 'NetworkHash',
				selector: cardanoBlockNetworkHashSelector,
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
		&& matchStringSegment(params.blockHash)
	) {
		const cosmosBlockNetworkHashSelector = parseEntitySelector(
			schema,
			CosmosBlockSchema,
			{
				$network: parentData.selector,
				hash: params.blockHash,
			},
			'NetworkHash'
		)
		if (!(cosmosBlockNetworkHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.CosmosBlock,
				selectorName: 'NetworkHash',
				selector: cosmosBlockNetworkHashSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Hedera' && matchStringSegment(params.blockHash)) {
		const hederaBlockNetworkBlockHashSelector = parseEntitySelector(
			schema,
			HederaBlockSchema,
			{
				$network: parentData.selector,
				blockHash: params.blockHash,
			},
			'NetworkBlockHash'
		)
		if (!(hederaBlockNetworkBlockHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.HederaBlock,
				selectorName: 'NetworkBlockHash',
				selector: hederaBlockNetworkBlockHashSelector,
			})
	}

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
