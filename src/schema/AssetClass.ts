// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	classKind: {
		label: 'Class kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	classKey: {
		label: 'Class key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slot: {
		label: 'Slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	partition: {
		label: 'Partition',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	series: {
		label: 'Series',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maturityMs: {
		label: 'Maturity',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueDecimals: {
		label: 'Value decimals',
		type: EntityFieldType.Primitive,
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
