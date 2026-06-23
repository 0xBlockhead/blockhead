import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AvalancheBlockchainSelector {
	BlockchainId = 'blockchainId',
}
export default {
	entityType: EntityType.AvalancheBlockchain,
	label: 'avalanche blockchain',
	labelPlural: 'avalanche blockchains',
	selectors: [
		{
			name: AvalancheBlockchainSelector.BlockchainId,
			fields: [
				'blockchainId',
			],
		},
	],
	fields: [
		{
			name: 'blockchainId',
			label: 'blockchain ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$subnet',
			label: 'subnet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AvalancheSubnet,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'vmId',
			label: 'vm ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'chainName',
			label: 'chain name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'chainAlias',
			label: 'chain alias',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'genesisDataHash',
			label: 'genesis data hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAtTxId',
			label: 'created AT transaction ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
