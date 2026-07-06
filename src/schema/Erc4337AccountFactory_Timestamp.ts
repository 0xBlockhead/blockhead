// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum Erc4337AccountFactory_TimestampSelector {
	FactoryTimestampMsSource = 'FactoryTimestampMsSource',
}
export default {
	entityType: EntityType.Erc4337AccountFactory_Timestamp,
	label: 'ERC-4337 account factory timestamp',
	labelPlural: 'ERC-4337 account factory observations',
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
			label: 'Factory',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Erc4337AccountFactory,
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
			name: 'userOperationsCount',
			label: 'User operations',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'smartAccountsCount',
			label: 'Smart accounts',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
