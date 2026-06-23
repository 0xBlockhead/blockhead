import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum PolkadotBlockSelector {
	NetworkBlockNumber = 'networkBlockNumber',
	NetworkBlockNumberHash = 'networkBlockNumberHash',
}
export default {
	entityType: EntityType.PolkadotBlock,
	label: 'polkadot block',
	labelPlural: 'polkadot blocks',
	selectors: [
		{
			name: PolkadotBlockSelector.NetworkBlockNumber,
			fields: [
				'$network',
				'blockNumber',
			],
		},
		{
			name: PolkadotBlockSelector.NetworkBlockNumberHash,
			fields: [
				'$network',
				'blockNumber',
				'hash',
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
			name: 'blockNumber',
			label: 'Block number',
			description: 'The block height or number in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			label: 'Hash',
			description: 'The hash that identifies this object in its protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$parent',
			label: 'parent',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'stateRoot',
			label: 'state root',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'extrinsicsRoot',
			label: 'extrinsics root',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$extrinsics',
			label: 'extrinsics',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotExtrinsic,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$events',
			label: 'events',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotEvent,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
