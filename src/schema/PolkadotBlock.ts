import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum PolkadotBlockSelector {
	NetworkBlockNumberHash = 'networkBlockNumberHash',
}

export default {
	entityType: EntityType.PolkadotBlock,

	label: 'Polkadot Block',
	labelPlural: 'Polkadot Blocks',

	selectors: [
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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockNumber',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$parent',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'stateRoot',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'extrinsicsRoot',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$extrinsics',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotExtrinsic,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$events',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotEvent,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
