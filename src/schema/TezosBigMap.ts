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
		label: 'contract',
		entityType: EntityType.TezosContract,
		cardinality: EntityFieldCardinality.One,
	},
	bigMapId: {
		label: 'big map ID',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	path: {
		label: 'path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	keyType: {
		label: 'key type',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueType: {
		label: 'value type',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$keys: {
		label: 'keys',
		entityType: EntityType.TezosBigMapKey,
		cardinality: EntityFieldCardinality.Many,
	},
	$$updates: {
		label: 'updates',
		entityType: EntityType.TezosBigMapDiff,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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
