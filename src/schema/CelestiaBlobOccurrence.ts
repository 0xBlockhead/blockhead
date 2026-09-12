// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CelestiaBlobOccurrence,
	labels: {
		singular: 'celestia blob occurrence',
		plural: 'celestia blob occurrences',
	},
})({
	$block: {
		entityType: EntityType.CelestiaBlock,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.CelestiaNode,
		],
	},
	index: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.CelestiaNode,
		],
	},
	$namespace: {
		entityType: EntityType.CelestiaNamespace,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.CelestiaNode,
		],
	},
	height: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.CelestiaNode,
		],
	},
	$blob: {
		entityType: EntityType.CelestiaBlob,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.CelestiaNode,
		],
	},
})({
	selectors: {
		BlockIndex: [
			'$block',
			'index',
		],
		NamespaceHeightIndex: [
			'$namespace',
			'height',
			'index',
		],
	},
})
