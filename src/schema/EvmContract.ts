import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/Network.ts'

export default {
	entityType: EntityType.EvmContract,

	label: 'EVM Contract',
	labelPlural: 'EVM Contracts',

	id: type({
		$network: Network.id,
		address: 'string.hex' as type.cast<`0x${string}`>,
	}),

	fields: [
		{
			name: '$deployer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Actor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$creationTransaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$implementation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'bytecodeHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string.hex' as type.cast<`0x${string}`>),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'code',
			type: EntityFieldType.Primitive,
			primitiveType: type('string.hex' as type.cast<`0x${string}`>),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'abi',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$verifiedSource',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContractSource,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
