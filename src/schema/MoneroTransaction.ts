import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum MoneroTransactionSelector {
	NetworkTxHash = 'networkTxHash',
}
export default {
	entityType: EntityType.MoneroTransaction,
	label: 'monero transaction',
	labelPlural: 'monero transactions',
	selectors: [
		{
			name: MoneroTransactionSelector.NetworkTxHash,
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
			entityType: EntityType.MoneroBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'version',
			label: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'unlockTime',
			label: 'unlock time',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeAtomicUnits',
			label: 'fee atomic units',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$keyImages',
			label: 'key images',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoneroKeyImage,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$stealthOutputs',
			label: 'stealth outputs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoneroStealthOutput,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
