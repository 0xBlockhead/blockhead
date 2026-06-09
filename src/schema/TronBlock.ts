import { type } from 'arktype'
import { lowercaseHexIdentityValue } from '$/schema/ZeroExHex.ts'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'
import TronWitness from '$/schema/TronWitness.ts'
import { Source } from '$/sources/Source.ts'

const tronPublicBlockSources = [
	Source.TronScan_Rest,
	Source.TronGrid_Rest,
]

export default {
	entityType: EntityType.TronBlock,

	label: 'TRON Block',
	labelPlural: 'TRON Blocks',

	id: type({
		$network: Network.id,
		height: 'bigint',
		'hash?': 'string',
	}),

	identities: [
		{
			name: 'heightHash',
			fields: [
				{
					name: '$network',
				},
				{
					name: 'height',
				},
				{
					name: 'hash',
					normalize: lowercaseHexIdentityValue,
				},
			],
		},
	],

	fields: [
		{
			name: 'hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicBlockSources,
		},
		{
			name: '$parent',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicBlockSources,
		},
		{
			name: 'parentHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicBlockSources,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicBlockSources,
		},
		{
			name: '$witness',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronWitness,
			entityId: TronWitness.id,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicBlockSources,
		},
		{
			name: 'txTrieRoot',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicBlockSources,
		},
		{
			name: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicBlockSources,
		},
		{
			name: 'transactionCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicBlockSources,
		},
		{
			name: '$$transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronTransaction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
