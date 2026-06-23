import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum IcpLedgerBlockSelector {
	LedgerBlockIndex = '$ledger+blockIndex',
}
export default {
	entityType: EntityType.IcpLedgerBlock,
	label: 'icp ledger block',
	labelPlural: 'icp ledger blocks',
	selectors: [
		{
			name: IcpLedgerBlockSelector.LedgerBlockIndex,
			fields: [
				'$ledger',
				'blockIndex',
			],
		},
	],
	fields: [
		{
			name: '$ledger',
			label: 'ledger',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.IcpLedgerCanister,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockIndex',
			label: 'block index',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockHash',
			label: 'Block hash',
			description: 'The hash that identifies the block in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'parentHash',
			label: 'parent hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestampNs',
			label: 'timestamp ns',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionCount',
			label: 'transaction count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'archiveCanisterId',
			label: 'archive canister ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.IcpLedgerTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
