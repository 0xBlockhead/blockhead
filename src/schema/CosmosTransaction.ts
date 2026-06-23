import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CosmosTransactionSelector {
	NetworkTxHash = 'networkTxHash',
}
export default {
	entityType: EntityType.CosmosTransaction,
	label: 'Cosmos transaction',
	labelPlural: 'Cosmos transactions',
	selectors: [
		{
			name: CosmosTransactionSelector.NetworkTxHash,
			fields: [
				'$network',
				'txHash',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'txHash',
			label: 'Transaction hash',
			description: 'The transaction hash in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$block',
			label: 'block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'code',
			label: 'code',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'codespace',
			label: 'codespace',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gasWanted',
			label: 'gas wanted',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gasUsed',
			label: 'gas used',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeAmount',
			label: 'fee amount',
			type: EntityFieldType.Primitive,
			primitiveType: type({"denom": "string", "amount": "bigint"}),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'feeGasLimit',
			label: 'fee gas limit',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'memo',
			label: 'memo',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timeoutHeight',
			label: 'timeout height',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'signerAddresses',
			label: 'signer addresses',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'publicKeys',
			label: 'public keys',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'signatures',
			label: 'signatures',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'rawLog',
			label: 'raw log',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'eventTypes',
			label: 'event types',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$messages',
			label: 'messages',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosMessage,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
