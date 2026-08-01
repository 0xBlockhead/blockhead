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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	namespace: {
		label: 'Namespace',
		description: 'The namespace that qualifies the identifier.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	key: {
		label: 'key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$logEntry: {
		label: 'log entry',
		entityType: EntityType.ZeroGStorageLogEntry,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$owner: {
		label: 'owner',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueHash: {
		label: 'value hash',
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
