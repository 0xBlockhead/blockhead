// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CelestiaNamespace,
	labels: {
		singular: 'celestia namespace',
		plural: 'celestia namespaces',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.CelestiaNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	namespaceId: {
		label: 'namespace ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	namespaceVersion: {
		label: 'namespace version',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$blobs: {
		label: 'blobs',
		entityType: EntityType.CelestiaBlob,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.CelestiaNamespace_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkNamespaceId: [
			'$network',
			'namespaceId',
		],
	},
})
