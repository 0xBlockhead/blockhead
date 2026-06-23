import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum Erc4337Bundler_TimestampSelector {
	BundlerTimestampMsSource = '$bundler+timestampMs+source',
}
export default {
	entityType: EntityType.Erc4337Bundler_Timestamp,
	label: 'erc4337 bundler timestamp',
	labelPlural: 'erc4337 bundler observations',
	selectors: [
		{
			name: Erc4337Bundler_TimestampSelector.BundlerTimestampMsSource,
			fields: [
				'$bundler',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$bundler',
			label: 'bundler',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Erc4337Bundler,
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
			name: 'userOperationsCount',
			label: 'user operations count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
