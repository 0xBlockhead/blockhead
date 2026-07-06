// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BnbBeaconTokenTransferSelector {
	TransactionTransferIndex = 'TransactionTransferIndex',
}
export default {
	entityType: EntityType.BnbBeaconTokenTransfer,
	label: 'bnb beacon token transfer',
	labelPlural: 'bnb beacon token transfers',
	selectors: [
		{
			name: BnbBeaconTokenTransferSelector.TransactionTransferIndex,
			fields: [
				'$transaction',
				'transferIndex',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BnbBeaconTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transferIndex',
			label: 'transfer index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'symbol',
			label: 'Symbol',
			description: 'The short ticker or symbol used for display.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fromAddress',
			label: 'from address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'toAddress',
			label: 'to address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amount',
			label: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$token',
			label: 'token',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BnbBeaconToken,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
