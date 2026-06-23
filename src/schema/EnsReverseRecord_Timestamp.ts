import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EnsReverseRecord_TimestampSelector {
	ReverseRecordTimestampMsSource = '$reverseRecord+timestampMs+source',
}
export default {
	entityType: EntityType.EnsReverseRecord_Timestamp,
	label: 'ENS reverse record timestamp',
	labelPlural: 'ENS reverse record observations',
	selectors: [
		{
			name: EnsReverseRecord_TimestampSelector.ReverseRecordTimestampMsSource,
			fields: [
				'$reverseRecord',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$reverseRecord',
			label: 'reverse record',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EnsReverseRecord,
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
			name: 'verified',
			label: 'verified',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'resolverSelector',
			label: 'resolver selector',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
