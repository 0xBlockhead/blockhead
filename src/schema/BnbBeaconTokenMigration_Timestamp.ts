// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BnbBeaconTokenMigration_TimestampSelector {
	MigrationTimestampMsSource = 'MigrationTimestampMsSource',
}
export const BnbBeaconTokenMigration_Timestamp = entity({
	entityType: EntityType.BnbBeaconTokenMigration_Timestamp,
	label: 'bnb beacon token migration timestamp',
	labelPlural: 'bnb beacon token migration observations',
})({
	$migration: {
		label: 'migration',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BnbBeaconTokenMigration,
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
	observedAtMs: {
		label: 'observed AT ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		MigrationTimestampMsSource: [
			'$migration',
			'timestampMs',
			'source',
		],
	},
})
