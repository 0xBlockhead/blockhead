// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum TronTokenTransferSelector {
	NetworkTransactionIdTransferIndex = 'NetworkTransactionIdTransferIndex',
}
export default {
	entityType: EntityType.TronTokenTransfer,
	label: 'tron token transfer',
	labelPlural: 'tron token transfers',
	selectors: [
		{
			name: TronTokenTransferSelector.NetworkTransactionIdTransferIndex,
			fields: [
				'$network',
				'transactionId',
				'transferIndex',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transactionId',
			label: 'Transaction ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transferIndex',
			label: 'Transfer index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$transaction',
			label: 'Transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: '$token',
			label: 'Token',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronToken,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: 'standard',
			label: 'Standard',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: '$from',
			label: 'From',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: '$to',
			label: 'To',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: 'amount',
			label: 'Amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
	],
} as const satisfies EntityDefinition
