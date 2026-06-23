import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum TonJettonTransferSelector {
	NetworkTransferIdSource = '$network+transferId+source',
}
export default {
	entityType: EntityType.TonJettonTransfer,
	label: 'ton jetton transfer',
	labelPlural: 'ton jetton transfers',
	selectors: [
		{
			name: TonJettonTransferSelector.NetworkTransferIdSource,
			fields: [
				'$network',
				'transferId',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transferId',
			label: 'transfer ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
			name: '$jetton',
			label: 'jetton',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonJetton,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$from',
			label: 'from',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$to',
			label: 'to',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$trace',
			label: 'trace',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonTrace,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$message',
			label: 'message',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonMessage,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionLt',
			label: 'transaction lt',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionHash',
			label: 'transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amountNano',
			label: 'amount nano',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'queryId',
			label: 'query ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'forwardTonAmountNano',
			label: 'forward ton amount nano',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'responseDestination',
			label: 'response destination',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'customPayloadHash',
			label: 'custom payload hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
