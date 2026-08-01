// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AssetClass,
	labels: {
		singular: 'asset class',
		plural: 'asset classes',
	},
	description: 'A reusable asset classification used to group related asset instances and objects.',
})({
	$assetInstance: {
		label: 'Asset instance',
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	classKind: {
		label: 'Class kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	classKey: {
		label: 'Class key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slot: {
		label: 'Slot',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	partition: {
		label: 'Partition',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	series: {
		label: 'Series',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maturityMs: {
		label: 'Maturity',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueDecimals: {
		label: 'Value decimals',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AssetInstanceClassKindClassKey: [
			'$assetInstance',
			'classKind',
			'classKey',
		],
	},
})
