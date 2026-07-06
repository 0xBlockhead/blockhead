// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonWorkchainSelector {
	NetworkWorkchain = 'NetworkWorkchain',
}
export default {
	entityType: EntityType.TonWorkchain,
	label: 'ton workchain',
	labelPlural: 'ton workchains',
	selectors: [
		{
			name: TonWorkchainSelector.NetworkWorkchain,
			fields: [
				'$network',
				'workchain',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'workchain',
			label: 'workchain',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'addressFormat',
			label: 'address format',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionFormat',
			label: 'transaction format',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'virtualMachine',
			label: 'virtual machine',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$shards',
			label: 'shards',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonShard_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$blocks',
			label: 'blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonBlock,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
