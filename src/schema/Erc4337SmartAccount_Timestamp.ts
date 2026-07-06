// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum Erc4337SmartAccount_TimestampSelector {
	AccountTimestampMsSource = 'AccountTimestampMsSource',
}
export default {
	entityType: EntityType.Erc4337SmartAccount_Timestamp,
	label: 'ERC-4337 smart account timestamp',
	labelPlural: 'ERC-4337 smart account observations',
	selectors: [
		{
			name: Erc4337SmartAccount_TimestampSelector.AccountTimestampMsSource,
			fields: [
				'$account',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$account',
			label: 'Smart account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Erc4337SmartAccount,
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
	],
} as const satisfies EntityDefinition
