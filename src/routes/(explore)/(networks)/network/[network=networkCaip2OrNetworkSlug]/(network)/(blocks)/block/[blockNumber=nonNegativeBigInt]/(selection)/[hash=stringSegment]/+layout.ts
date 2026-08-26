// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
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

	const polkadotBlockNetworkBlockNumberHashSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')
				)
				&& parentData.projectionNetwork.namespace === 'Polkadot'
			)
			&& matchNonNegativeBigInt(params.blockNumber)
			&& matchStringSegment(params.hash)
		))
			return

		const polkadotBlockNetworkBlockNumberHashSelector = parseRouteEntitySelector(
			schema,
			PolkadotBlockSchema,
			{
				$network: parentData.selector.$network,
				blockNumber: BigInt(params.blockNumber),
				hash: params.hash,
			},
			'NetworkBlockNumberHash'
		)
		if ((!(polkadotBlockNetworkBlockNumberHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.PolkadotBlock,
				selectorName: 'NetworkBlockNumberHash',
				selector: polkadotBlockNetworkBlockNumberHashSelector,
			} as const
	})()

	const utxoBlockNetworkHeightHashSelectorCandidate = (() => {
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
			&& matchStringSegment(params.hash)
		))
			return

		const utxoBlockNetworkHeightHashSelector = parseRouteEntitySelector(
			schema,
			UtxoBlockSchema,
			{
				$network: parentData.selector.$network,
				height: BigInt(params.blockNumber),
				hash: params.hash,
			},
			'NetworkHeightHash'
		)
		if ((!(utxoBlockNetworkHeightHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.UtxoBlock,
				selectorName: 'NetworkHeightHash',
				selector: utxoBlockNetworkHeightHashSelector,
			} as const
	})()

	const bittensorBlockNetworkBlockNumberHashSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Bittensor'
			&& matchStringSegment(params.hash)
			&& matchNonNegativeBigInt(params.blockNumber)
		))
			return

		const bittensorBlockNetworkBlockNumberHashSelector = parseRouteEntitySelector(
			schema,
			BittensorBlockSchema,
			{
				$network: parentData.selector,
				blockNumber: BigInt(params.blockNumber),
				hash: params.hash,
			},
			'NetworkBlockNumberHash'
		)
		if ((!(bittensorBlockNetworkBlockNumberHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.BittensorBlock,
				selectorName: 'NetworkBlockNumberHash',
				selector: bittensorBlockNetworkBlockNumberHashSelector,
			} as const
	})()

	const moneroBlockNetworkHeightHashSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Monero'
			&& matchStringSegment(params.hash)
			&& matchNonNegativeBigInt(params.blockNumber)
		))
			return

		const moneroBlockNetworkHeightHashSelector = parseRouteEntitySelector(
			schema,
			MoneroBlockSchema,
			{
				$network: parentData.selector.$network,
				height: BigInt(params.blockNumber),
				hash: params.hash,
			},
			'NetworkHeightHash'
		)
		if ((!(moneroBlockNetworkHeightHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.MoneroBlock,
				selectorName: 'NetworkHeightHash',
				selector: moneroBlockNetworkHeightHashSelector,
			} as const
	})()

	const nearBlockNetworkHeightHashSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Near'
			&& matchStringSegment(params.hash)
			&& matchNonNegativeBigInt(params.blockNumber)
		))
			return

		const nearBlockNetworkHeightHashSelector = parseRouteEntitySelector(
			schema,
			NearBlockSchema,
			{
				$network: parentData.selector.$network,
				height: BigInt(params.blockNumber),
				hash: params.hash,
			},
			'NetworkHeightHash'
		)
		if ((!(nearBlockNetworkHeightHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.NearBlock,
				selectorName: 'NetworkHeightHash',
				selector: nearBlockNetworkHeightHashSelector,
			} as const
	})()

	const tronBlockNetworkHeightHashSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Tron'
			&& matchStringSegment(params.hash)
			&& matchNonNegativeBigInt(params.blockNumber)
		))
			return

		const tronBlockNetworkHeightHashSelector = parseRouteEntitySelector(
			schema,
			TronBlockSchema,
			{
				$network: parentData.selector.$network,
				height: BigInt(params.blockNumber),
				hash: params.hash,
			},
			'NetworkHeightHash'
		)
		if ((!(tronBlockNetworkHeightHashSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.TronBlock,
				selectorName: 'NetworkHeightHash',
				selector: tronBlockNetworkHeightHashSelector,
			} as const
	})()

	const routeCandidates = [
		polkadotBlockNetworkBlockNumberHashSelectorCandidate,
		utxoBlockNetworkHeightHashSelectorCandidate,
		bittensorBlockNetworkBlockNumberHashSelectorCandidate,
		moneroBlockNetworkHeightHashSelectorCandidate,
		nearBlockNetworkHeightHashSelectorCandidate,
		tronBlockNetworkHeightHashSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
