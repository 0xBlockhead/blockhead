import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum Erc4337AccountFactory_TimestampSelector {
	FactoryTimestampMsSource = '$factory+timestampMs+source',
}
export default {
	entityType: EntityType.Erc4337AccountFactory_Timestamp,
	label: 'erc4337 account factory timestamp',
	labelPlural: 'erc4337 account factory observations',
	selectors: [
		{
			name: Erc4337AccountFactory_TimestampSelector.FactoryTimestampMsSource,
			fields: [
				'$factory',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$factory',
			label: 'factory',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Erc4337AccountFactory,
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
		{
			name: 'smartAccountsCount',
			label: 'smart accounts count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
