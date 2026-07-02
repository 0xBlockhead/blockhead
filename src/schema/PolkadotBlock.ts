// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PolkadotBlockSelector {
	NetworkBlockNumber = 'NetworkBlockNumber',
	NetworkBlockNumberHash = 'NetworkBlockNumberHash',
}
export default {
	entityType: EntityType.PolkadotBlock,
	label: 'Polkadot block',
	labelPlural: 'Polkadot blocks',
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
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
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
				name: 'hash',
				label: 'Hash',
				description: 'The hash that identifies this object in its protocol.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$parent',
				label: 'Parent',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.PolkadotBlock,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'stateRoot',
				label: 'State root',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'extrinsicsRoot',
				label: 'Extrinsics root',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$extrinsics',
				label: 'Extrinsics',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.PolkadotExtrinsic,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$events',
				label: 'Events',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.PolkadotEvent,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
