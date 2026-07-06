// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum Erc4337Paymaster_TimestampSelector {
	PaymasterTimestampMsSource = 'PaymasterTimestampMsSource',
}
export default {
	entityType: EntityType.Erc4337Paymaster_Timestamp,
	label: 'ERC-4337 paymaster timestamp',
	labelPlural: 'ERC-4337 paymaster observations',
	selectors: [
		{
			name: Erc4337Paymaster_TimestampSelector.PaymasterTimestampMsSource,
			fields: [
				'$paymaster',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$paymaster',
			label: 'Paymaster',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Erc4337Paymaster,
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
