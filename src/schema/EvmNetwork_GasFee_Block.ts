import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/EvmNetwork.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.EvmNetwork_GasFee_Block,

	label: 'Network gas fee block snapshot',
	labelPlural: 'Network gas fee block snapshots',

	id: type({
		$network: Network.id,
		blockNumber: 'bigint',
	}),

	fields: [
		{
			name: 'baseFeePerGas',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: 'legacyGasPrice',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: 'maxPriorityFeePerGas',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: 'gasUsedRatio',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: 'priorityFeeRewardAt50thPercentile',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: 'baseFeePerBlobGas',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: 'blobGasUsedRatio',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
