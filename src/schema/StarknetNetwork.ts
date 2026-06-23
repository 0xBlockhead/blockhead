import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum StarknetNetworkSelector {
	Network = '$network',
}
export default {
	entityType: EntityType.StarknetNetwork,
	label: 'starknet network',
	labelPlural: 'starknet networks',
	selectors: [
		{
			name: StarknetNetworkSelector.Network,
			fields: [
				'$network',
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
			name: 'chainId',
			label: 'Chain ID',
			description: 'The chain identifier used by the network family.',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StarknetNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$blocks',
			label: 'blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StarknetBlock,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StarknetTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$contracts',
			label: 'contracts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StarknetContract,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$classes',
			label: 'classes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StarknetClass,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
