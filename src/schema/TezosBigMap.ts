// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TezosBigMap,
	labels: {
		singular: 'tezos big map',
		plural: 'tezos big maps',
	},
})({
	$contract: {
		entityType: EntityType.TezosContract,
		cardinality: EntityFieldCardinality.One,
	},
	bigMapId: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	path: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	keyType: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueType: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$keys: {
		entityType: EntityType.TezosBigMapKey,
		cardinality: EntityFieldCardinality.Many,
	},
	$$updates: {
		entityType: EntityType.TezosBigMapDiff,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.TezosBigMap_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ContractBigMapId: [
			'$contract',
			'bigMapId',
		],
	},
})
