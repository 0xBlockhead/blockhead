// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AssetSupply_Timestamp,
	labels: {
		singular: 'asset supply timestamp',
		plural: 'asset supply observations',
	},
})({
	$assetInstance: {
		label: 'Asset instance',
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	supplyScopeKey: {
		label: 'Supply scope key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$class: {
		label: 'Class',
		entityType: EntityType.AssetClass,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	classKey: {
		label: 'Class key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	totalSupply: {
		label: 'Total supply',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	circulatingSupply: {
		label: 'Circulating supply',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	burnedSupply: {
		label: 'Burned supply',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	methodology: {
		label: 'Methodology',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AssetInstanceSupplyScopeKeyTimestampMsSource: [
			'$assetInstance',
			'supplyScopeKey',
			'timestampMs',
			'source',
		],
	},
})
