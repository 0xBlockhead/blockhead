// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmBlockSchema from '$/schema/EvmBlock.ts'
import { schema } from '$/schema/index.ts'
import PolkadotBlockSchema from '$/schema/PolkadotBlock.ts'
import SolanaBlockSchema from '$/schema/SolanaBlock.ts'
import UtxoBlockSchema from '$/schema/UtxoBlock.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

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
	)[] = []

	if (((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')) && projectionNetwork.namespace === 'Evm') && matchNonNegativeBigInt(params.blockNumber)) {
		const evmBlockEvmNetworkBlockNumberSelector = parseEntitySelector(
			schema,
			EvmBlockSchema,
			{
				$network: parentData.selector,
				blockNumber: BigInt(params.blockNumber),
			}
		)
		if (!(evmBlockEvmNetworkBlockNumberSelector instanceof arktype.errors) && '$network' in evmBlockEvmNetworkBlockNumberSelector && 'blockNumber' in evmBlockEvmNetworkBlockNumberSelector)
			routeCandidates.push({ entityType: EntityType.EvmBlock, selectorName: 'EvmNetworkBlockNumber', selector: evmBlockEvmNetworkBlockNumberSelector })
	}

	if (((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'SolanaRuntime')) && projectionNetwork.namespace === 'Solana') && matchNonNegativeBigInt(params.blockNumber)) {
		const solanaBlockSlotSelector = parseEntitySelector(
			schema,
			SolanaBlockSchema,
			{
				$network: parentData.selector,
				slot: BigInt(params.blockNumber),
			}
		)
		if (!(solanaBlockSlotSelector instanceof arktype.errors) && '$network' in solanaBlockSlotSelector && 'slot' in solanaBlockSlotSelector)
			routeCandidates.push({ entityType: EntityType.SolanaBlock, selectorName: 'Slot', selector: solanaBlockSlotSelector })
	}

	if (((projectionNetwork.ledgerModels !== undefined && projectionNetwork.ledgerModels.some((value: string | number | boolean | null) => value === 'Utxo')) && [
	'Bitcoin',
	'BitcoinCash',
	'Cardano',
	'Dogecoin',
	'Elements',
	'Litecoin',
	'Zcash',
].includes(projectionNetwork.namespace)) && matchNonNegativeBigInt(params.blockNumber)) {
		const utxoBlockNetworkHeightSelector = parseEntitySelector(
			schema,
			UtxoBlockSchema,
			{
				$network: parentData.selector,
				height: BigInt(params.blockNumber),
			}
		)
		if (!(utxoBlockNetworkHeightSelector instanceof arktype.errors) && '$network' in utxoBlockNetworkHeightSelector && 'height' in utxoBlockNetworkHeightSelector)
			routeCandidates.push({ entityType: EntityType.UtxoBlock, selectorName: 'NetworkHeight', selector: utxoBlockNetworkHeightSelector })
	}

	if (((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')) && projectionNetwork.namespace === 'Polkadot') && matchNonNegativeBigInt(params.blockNumber)) {
		const polkadotBlockNetworkBlockNumberSelector = parseEntitySelector(
			schema,
			PolkadotBlockSchema,
			{
				$network: parentData.selector,
				blockNumber: BigInt(params.blockNumber),
			}
		)
		if (!(polkadotBlockNetworkBlockNumberSelector instanceof arktype.errors) && '$network' in polkadotBlockNetworkBlockNumberSelector && 'blockNumber' in polkadotBlockNetworkBlockNumberSelector)
			routeCandidates.push({ entityType: EntityType.PolkadotBlock, selectorName: 'NetworkBlockNumber', selector: polkadotBlockNetworkBlockNumberSelector })
	}

	if (routeCandidates.length === 0) error(404, 'Route selector not applicable')
	if (routeCandidates.length > 1) error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
