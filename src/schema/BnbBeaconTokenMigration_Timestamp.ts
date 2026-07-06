// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BnbBeaconTokenMigration_TimestampSelector {
	MigrationTimestampMsSource = 'MigrationTimestampMsSource',
}
export default {
	entityType: EntityType.BnbBeaconTokenMigration_Timestamp,
	label: 'bnb beacon token migration timestamp',
	labelPlural: 'bnb beacon token migration observations',
	selectors: [
		{
			name: BnbBeaconTokenMigration_TimestampSelector.MigrationTimestampMsSource,
			fields: [
				'$migration',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$migration',
			label: 'migration',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BnbBeaconTokenMigration,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'observedAtMs',
			label: 'observed AT ms',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
