import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum NearBlockSelector {
	NetworkHeight = 'networkHeight',
	NetworkHeightHash = 'networkHeightHash',
}

export default {
	entityType: EntityType.NearBlock,

	label: 'NEAR Block',
	labelPlural: 'NEAR Blocks',

	selectors: [
		{
			name: NearBlockSelector.NetworkHeight,
			fields: [
				'$network',
				'height',
			],
		},
		{
			name: NearBlockSelector.NetworkHeightHash,
			fields: [
				'$network',
				'height',
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
			name: 'height',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$parent',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'epochId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$chunks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearChunk,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
