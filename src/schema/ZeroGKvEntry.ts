// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ZeroGKvEntry,
	labels: {
		singular: 'zero g kv entry',
		plural: 'zero g kv entries',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	namespace: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	key: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$logEntry: {
		entityType: EntityType.ZeroGStorageLogEntry,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$owner: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkNamespaceKey: [
			'$network',
			'namespace',
			'key',
		],
	},
})
