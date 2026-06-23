import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CelestiaNamespace_TimestampSelector {
	NamespaceTimestampMsSource = '$namespace+timestampMs+source',
}
export default {
	entityType: EntityType.CelestiaNamespace_Timestamp,
	label: 'celestia namespace timestamp',
	labelPlural: 'celestia namespace observations',
	selectors: [
		{
			name: CelestiaNamespace_TimestampSelector.NamespaceTimestampMsSource,
			fields: [
				'$namespace',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$namespace',
			label: 'Namespace',
			description: 'The namespace that qualifies the identifier.',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CelestiaNamespace,
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
			name: 'height',
			label: 'Height',
			description: 'The block or ledger height in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'blobCount',
			label: 'blob count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sourceWindowStartHeight',
			label: 'source window start height',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sourceWindowEndHeight',
			label: 'source window end height',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
