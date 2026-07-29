// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitcoinCashCashTokenNft,
	labels: {
		singular: 'Bitcoin Cash CashToken NFT',
		plural: 'Bitcoin Cash CashToken NFTs',
	},
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
