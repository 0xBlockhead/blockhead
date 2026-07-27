// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EnsRecord,
	labels: {
		singular: 'ENS record',
		plural: 'ENS records',
	},
})({
	$name: {
		label: 'Name',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EnsName,
		cardinality: EntityFieldCardinality.One,
	},
	recordKey: {
		label: 'Record key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	recordKind: {
		label: 'Record kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	coinType: {
		label: 'Coin type',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EnsRecord_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NameRecordKey: [
			'$name',
			'recordKey',
		],
	},
})
