import { type } from 'arktype'

import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	conditionalOn,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmInternalCallType } from '$/constants/Evm.ts'
import { Source } from '$/sources/Source.ts'

export enum EvmInternalTransferSelector {
	EvmNetworkTxHashInternalIndex = 'evmNetworkTxHashInternalIndex',
}


const evmInternalTransferDiscriminatorFields = [
	{
		name: 'callType',
		type: EntityFieldType.Primitive,
		primitiveType: type.valueOf(EvmInternalCallType),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
] as const satisfies readonly EntityFieldDefinition[]

export default {
	entityType: EntityType.EvmInternalTransfer,

	label: 'Internal transfer',
	labelPlural: 'Internal transfers',

	selectors: [
		{
			name: EvmInternalTransferSelector.EvmNetworkTxHashInternalIndex,
			fields: [
				'$network',
				'txHash',
				'internalIndex',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'txHash',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'internalIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$from',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$to',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'value',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		...evmInternalTransferDiscriminatorFields,
		{
			name: 'success',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$createdContract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: conditionalOn(
				evmInternalTransferDiscriminatorFields,
				'callType',
				[
					EvmInternalCallType.Create,
					EvmInternalCallType.Create2,
				]
			),
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
