import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AptosTransactionSelector {
	NetworkVersion = '$network+version',
	NetworkHash = '$network+hash',
}
export default {
	entityType: EntityType.AptosTransaction,
	label: 'aptos transaction',
	labelPlural: 'aptos transactions',
	selectors: [
		{
			name: AptosTransactionSelector.NetworkVersion,
			fields: [
				'$network',
				'version',
			],
		},
		{
			name: AptosTransactionSelector.NetworkHash,
			fields: [
				'$network',
				'hash',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AptosNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'version',
			label: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'hash',
			label: 'Hash',
			description: 'The hash that identifies this object in its protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionKind',
			label: 'transaction kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sender',
			label: 'sender',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AptosTransaction_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$stateChanges',
			label: 'state changes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AptosStateChange,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$events',
			label: 'events',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AptosEvent,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
