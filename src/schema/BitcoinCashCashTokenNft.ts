// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum BitcoinCashCashTokenNftSelector {
	UtxoOutput = 'UtxoOutput',
}
export const BitcoinCashCashTokenNft = entity({
	entityType: EntityType.BitcoinCashCashTokenNft,
	label: 'Bitcoin Cash CashToken NFT',
	labelPlural: 'Bitcoin Cash CashToken NFTs',
})({
	$output: {
		label: 'Output',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.One,
	},
	$category: {
		label: 'Category',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BitcoinCashCashTokenCategory,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.BitcoinCashNode_JsonRpc,
		],
	},
	$commitment: {
		label: 'Commitment',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BitcoinCashCashTokenCommitment,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitcoinCashNode_JsonRpc,
		],
	},
	capability: {
		label: 'Capability',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.BitcoinCashNode_JsonRpc,
		],
	},
})({
	selectors: {
		UtxoOutput: [
			'$output',
		],
	},
})
