// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TezosBakingRight_Timestamp,
	labels: {
		singular: 'tezos baking right timestamp',
		plural: 'tezos baking right observations',
	},
})({
	$right: {
		label: 'right',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosBakingRight,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		label: 'status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	estimatedTimeMs: {
		label: 'estimated time ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$block: {
		label: 'block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RightTimestampMsSource: [
			'$right',
			'timestampMs',
			'source',
		],
	},
})
