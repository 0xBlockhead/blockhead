import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EvmNetwork_GasFee_BlockSelector {
	EvmNetworkBlockNumber = 'evmNetworkBlockNumber',
	NetworkBlockNumber = '$network+blockNumber',
}
export default {
	entityType: EntityType.EvmNetwork_GasFee_Block,
	label: 'EVM network gas fee block',
	labelPlural: 'EVM network gas fee blocks',
	selectors: [
		{
			name: EvmNetwork_GasFee_BlockSelector.EvmNetworkBlockNumber,
			fields: [
				'$network',
				'blockNumber',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockNumber',
			label: 'Block number',
			description: 'The block height or number in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'baseFeePerGas',
			label: 'base fee per gas',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'legacyGasPrice',
			label: 'legacy gas price',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'maxPriorityFeePerGas',
			label: 'max priority fee per gas',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gasUsedRatio',
			label: 'gas used ratio',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'priorityFeeRewardAt50thPercentile',
			label: 'priority fee reward at50th percentile',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'baseFeePerBlobGas',
			label: 'base fee per blob gas',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'blobGasUsedRatio',
			label: 'blob gas used ratio',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
