// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default entity({
	entityType: EntityType.CelestiaNetwork,
	labels: {
		singular: 'celestia network',
		plural: 'celestia networks',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.CelestiaNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Celenium_Rest,
			Source.CelestiaNode,
		],
	},
	$$blocks: {
		entityType: EntityType.CelestiaBlock,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Celenium_Rest,
			Source.CelestiaNode,
		],
	},
	$$namespaces: {
		entityType: EntityType.CelestiaNamespace,
		cardinality: EntityFieldCardinality.Many,
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
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
