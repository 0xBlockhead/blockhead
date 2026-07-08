// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum NetworkUpgrade_TimestampSelector {
	UpgradeTimestampMsSource = 'UpgradeTimestampMsSource',
}
export const NetworkUpgrade_Timestamp = entity({
	entityType: EntityType.NetworkUpgrade_Timestamp,
	label: 'network upgrade observation',
	labelPlural: 'network upgrade observations',
})({
	$upgrade: {
		label: 'Upgrade',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.NetworkUpgrade,
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
		label: 'Status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	activationHeight: {
		label: 'Activation height',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	activationTimestampMs: {
		label: 'Activation timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		UpgradeTimestampMsSource: [
			'$upgrade',
			'timestampMs',
			'source',
		],
	},
})
