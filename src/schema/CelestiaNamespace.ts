// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CelestiaNamespace,
	labels: {
		singular: 'celestia namespace',
		plural: 'celestia namespaces',
	},
})({
	$network: {
		entityType: EntityType.CelestiaNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	namespaceId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	namespaceVersion: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Celenium_Rest,
		],
	},
	label: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Celenium_Rest,
		],
	},
	$$blobs: {
		entityType: EntityType.CelestiaBlob,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Celenium_Rest,
		],
	},
	$$timestamps: {
		entityType: EntityType.CelestiaNamespace_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Celenium_Rest,
		],
	},
})({
	selectors: {
		NetworkNamespaceId: [
			'$network',
			'namespaceId',
		],
	},
})
