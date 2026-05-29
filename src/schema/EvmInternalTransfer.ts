import { type } from 'arktype'

import { ZeroExHex } from '$/schema/$ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	conditionalOn,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { EvmInternalCallType } from '$/constants/Evm.ts'
import Network from '$/schema/EvmNetwork.ts'
import { Source } from '$/sources/$Source.ts'

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

	id: type({
		$network: Network.id,
		txHash: ZeroExHex,
		internalIndex: 'number',
	}),

	fields: [
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
				],
			),
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
