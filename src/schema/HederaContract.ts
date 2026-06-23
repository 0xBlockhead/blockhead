import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
export enum HederaContractSelector {
	NetworkContractId = '$network+contractId',
}
export default {
	entityType: EntityType.HederaContract,
	label: 'hedera contract',
	labelPlural: 'hedera contracts',
	selectors: [
		{
			name: HederaContractSelector.NetworkContractId,
			fields: [
				'$network',
				'contractId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HederaNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'contractId',
			label: 'contract ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'evmAddress',
			label: 'EVM address',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdTimestamp',
			label: 'created timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$results',
			label: 'results',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaContractResult,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$logs',
			label: 'logs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaContractLog,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$state',
			label: 'state',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaContractState_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaContract_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
