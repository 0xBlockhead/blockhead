// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum TronTransactionSelector {
	NetworkTransactionId = 'NetworkTransactionId',
}
export default {
	entityType: EntityType.TronTransaction,
	label: 'tron transaction',
	labelPlural: 'tron transactions',
	selectors: [
		{
			name: TronTransactionSelector.NetworkTransactionId,
			fields: [
				'$network',
				'transactionId',
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
			name: '$block',
			label: 'Block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
				Source.TronScan_Rest,
				Source.ThreeXpl_Rest,
			],
		},
		{
			name: 'blockHeight',
			label: 'Block height',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
				Source.TronScan_Rest,
				Source.ThreeXpl_Rest,
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
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
				Source.TronScan_Rest,
				Source.ThreeXpl_Rest,
			],
		},
		{
			name: 'expirationTimestampMs',
			label: 'Expiration timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
			],
		},
		{
			name: 'contractType',
			label: 'Contract type',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
				Source.TronScan_Rest,
			],
		},
		{
			name: 'result',
			label: 'Result',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
				Source.TronScan_Rest,
			],
		},
		{
			name: 'feeSun',
			label: 'Fee sun',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: '$owner',
			label: 'Owner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
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
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
				Source.TronScan_Rest,
			],
		},
		{
			name: '$contract',
			label: 'Contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
				Source.TronScan_Rest,
			],
		},
		{
			name: 'amountSun',
			label: 'Amount sun',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
				Source.TronScan_Rest,
			],
		},
		{
			name: 'assetName',
			label: 'Asset name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
			],
		},
		{
			name: 'rawDataHex',
			label: 'Raw data hex',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
			],
		},
		{
			name: 'signatures',
			label: 'Signatures',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
			],
		},
		{
			name: '$receipt',
			label: 'Receipt',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronTransactionReceipt,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
				Source.TronScan_Rest,
			],
		},
		{
			name: '$$tokenTransfers',
			label: 'Token transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronTokenTransfer,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
	],
} as const satisfies EntityDefinition
