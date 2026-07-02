// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmNetwork_GasFee_BlockSelector {
	EvmNetworkBlockNumber = 'EvmNetworkBlockNumber',
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
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'blockNumber',
				label: 'Block number',
				description: 'The block height or number in its network.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'baseFeePerGas',
				label: 'Base fee per gas',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'legacyGasPrice',
				label: 'Legacy gas price',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'maxPriorityFeePerGas',
				label: 'Max priority fee per gas',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'gasUsedRatio',
				label: 'Gas used ratio',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'priorityFeeRewardAt50thPercentile',
				label: 'Priority fee reward at 50th percentile',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'baseFeePerBlobGas',
				label: 'Base fee per blob gas',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'blobGasUsedRatio',
				label: 'Blob gas used ratio',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
