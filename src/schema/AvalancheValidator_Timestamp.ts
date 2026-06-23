import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AvalancheValidator_TimestampSelector {
	ValidatorTimestampMsSource = '$validator+timestampMs+source',
}
export default {
	entityType: EntityType.AvalancheValidator_Timestamp,
	label: 'avalanche validator timestamp',
	labelPlural: 'avalanche validator observations',
	selectors: [
		{
			name: AvalancheValidator_TimestampSelector.ValidatorTimestampMsSource,
			fields: [
				'$validator',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$validator',
			label: 'validator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AvalancheValidator,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'connected',
			label: 'connected',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'uptimePercent',
			label: 'uptime percent',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'validatorSetKind',
			label: 'validator set kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'observedStakeNavax',
			label: 'observed stake navax',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'observedDelegatorCount',
			label: 'observed delegator count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
