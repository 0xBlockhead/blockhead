// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	namespace: {
		label: 'Namespace',
		description: 'The namespace that qualifies the identifier.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	key: {
		label: 'key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$logEntry: {
		label: 'log entry',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGStorageLogEntry,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$owner: {
		label: 'owner',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueHash: {
		label: 'value hash',
		type: EntityFieldType.Primitive,
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
