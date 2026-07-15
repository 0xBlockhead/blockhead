// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector, type EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { PolkadotBlock as PolkadotBlockSchema } from '$/schema/PolkadotBlock.ts'
import { UtxoBlock as UtxoBlockSchema } from '$/schema/UtxoBlock.ts'
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

	if (((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')) && projectionNetwork.namespace === 'Polkadot') && matchNonNegativeBigInt(params.blockNumber) && matchStringSegment(params.hash)) {
		const polkadotBlockNetworkBlockNumberHashSelector = parseEntitySelector(
			schema,
			PolkadotBlockSchema,
			{
				$network: parentData.selector.$network,
				blockNumber: BigInt(params.blockNumber),
				hash: params.hash,
			}
		)
		if (!(polkadotBlockNetworkBlockNumberHashSelector instanceof arktype.errors))
			selectorMappings.push({ entityType: EntityType.PolkadotBlock, selectorName: 'NetworkBlockNumberHash', selector: polkadotBlockNetworkBlockNumberHashSelector })
	}

	if (((projectionNetwork.ledgerModels !== undefined && projectionNetwork.ledgerModels.some((value: string | number | boolean | null) => value === 'Utxo')) && [
	'Bitcoin',
	'BitcoinCash',
	'Cardano',
	'Dogecoin',
	'Elements',
	'Litecoin',
	'Zcash',
].includes(projectionNetwork.namespace)) && matchNonNegativeBigInt(params.blockNumber) && matchStringSegment(params.hash)) {
		const utxoBlockNetworkHeightHashSelector = parseEntitySelector(
			schema,
			UtxoBlockSchema,
			{
				$network: parentData.selector.$network,
				height: BigInt(params.blockNumber),
				hash: params.hash,
			}
		)
		if (!(utxoBlockNetworkHeightHashSelector instanceof arktype.errors))
			selectorMappings.push({ entityType: EntityType.UtxoBlock, selectorName: 'NetworkHeightHash', selector: utxoBlockNetworkHeightHashSelector })
	}

	if (selectorMappings.length === 0) error(404, 'Route selector not applicable')
	if (selectorMappings.length > 1) error(500, 'Route selector is ambiguous')
	const selectorMapping = selectorMappings[0]

	return { selector: selectorMapping.selector, selectorMapping, selectorMappings }
}
