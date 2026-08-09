// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import BittensorBlockSchema from '$/schema/BittensorBlock.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import MoneroBlockSchema from '$/schema/MoneroBlock.ts'
import NearBlockSchema from '$/schema/NearBlock.ts'
import PolkadotBlockSchema from '$/schema/PolkadotBlock.ts'
import TronBlockSchema from '$/schema/TronBlock.ts'
import UtxoBlockSchema from '$/schema/UtxoBlock.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const routeCandidates: (
		| {
			readonly entityType: EntityType.PolkadotBlock
			readonly selectorName: 'NetworkBlockNumberHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.PolkadotBlock,
				'NetworkBlockNumberHash'
			>
		}
		| {
			readonly entityType: EntityType.UtxoBlock
			readonly selectorName: 'NetworkHeightHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.UtxoBlock,
				'NetworkHeightHash'
			>
		}
		| {
			readonly entityType: EntityType.BittensorBlock
			readonly selectorName: 'NetworkBlockNumberHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.BittensorBlock,
				'NetworkBlockNumberHash'
			>
		}
		| {
			readonly entityType: EntityType.MoneroBlock
			readonly selectorName: 'NetworkHeightHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.MoneroBlock,
				'NetworkHeightHash'
			>
		}
		| {
			readonly entityType: EntityType.NearBlock
			readonly selectorName: 'NetworkHeightHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.NearBlock,
				'NetworkHeightHash'
			>
		}
		| {
			readonly entityType: EntityType.TronBlock
			readonly selectorName: 'NetworkHeightHash'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.TronBlock,
				'NetworkHeightHash'
			>
		}
	)[] = []

	if (
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')
			)
			&& parentData.projectionNetwork.namespace === 'Polkadot'
		)
		&& matchNonNegativeBigInt(params.blockNumber)
		&& matchStringSegment(params.hash)
	) {
		const polkadotBlockNetworkBlockNumberHashSelector = parseEntitySelector(
			schema,
			PolkadotBlockSchema,
			{
				$network: parentData.selector.$network,
				blockNumber: BigInt(params.blockNumber),
				hash: params.hash,
			},
			'NetworkBlockNumberHash'
		)
		if (!(polkadotBlockNetworkBlockNumberHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.PolkadotBlock,
				selectorName: 'NetworkBlockNumberHash',
				selector: polkadotBlockNetworkBlockNumberHashSelector,
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
		&& matchStringSegment(params.hash)
	) {
		const utxoBlockNetworkHeightHashSelector = parseEntitySelector(
			schema,
			UtxoBlockSchema,
			{
				$network: parentData.selector.$network,
				height: BigInt(params.blockNumber),
				hash: params.hash,
			},
			'NetworkHeightHash'
		)
		if (!(utxoBlockNetworkHeightHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.UtxoBlock,
				selectorName: 'NetworkHeightHash',
				selector: utxoBlockNetworkHeightHashSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Bittensor'
		&& matchStringSegment(params.hash)
		&& matchNonNegativeBigInt(params.blockNumber)
	) {
		const bittensorBlockNetworkBlockNumberHashSelector = parseEntitySelector(
			schema,
			BittensorBlockSchema,
			{
				$network: parentData.selector,
				blockNumber: BigInt(params.blockNumber),
				hash: params.hash,
			},
			'NetworkBlockNumberHash'
		)
		if (!(bittensorBlockNetworkBlockNumberHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.BittensorBlock,
				selectorName: 'NetworkBlockNumberHash',
				selector: bittensorBlockNetworkBlockNumberHashSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Monero'
		&& matchStringSegment(params.hash)
		&& matchNonNegativeBigInt(params.blockNumber)
	) {
		const moneroBlockNetworkHeightHashSelector = parseEntitySelector(
			schema,
			MoneroBlockSchema,
			{
				$network: parentData.selector.$network,
				height: BigInt(params.blockNumber),
				hash: params.hash,
			},
			'NetworkHeightHash'
		)
		if (!(moneroBlockNetworkHeightHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.MoneroBlock,
				selectorName: 'NetworkHeightHash',
				selector: moneroBlockNetworkHeightHashSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Near'
		&& matchStringSegment(params.hash)
		&& matchNonNegativeBigInt(params.blockNumber)
	) {
		const nearBlockNetworkHeightHashSelector = parseEntitySelector(
			schema,
			NearBlockSchema,
			{
				$network: parentData.selector.$network,
				height: BigInt(params.blockNumber),
				hash: params.hash,
			},
			'NetworkHeightHash'
		)
		if (!(nearBlockNetworkHeightHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.NearBlock,
				selectorName: 'NetworkHeightHash',
				selector: nearBlockNetworkHeightHashSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Tron'
		&& matchStringSegment(params.hash)
		&& matchNonNegativeBigInt(params.blockNumber)
	) {
		const tronBlockNetworkHeightHashSelector = parseEntitySelector(
			schema,
			TronBlockSchema,
			{
				$network: parentData.selector.$network,
				height: BigInt(params.blockNumber),
				hash: params.hash,
			},
			'NetworkHeightHash'
		)
		if (!(tronBlockNetworkHeightHashSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.TronBlock,
				selectorName: 'NetworkHeightHash',
				selector: tronBlockNetworkHeightHashSelector,
			})
	}

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
