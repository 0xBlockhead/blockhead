import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum FilecoinTipsetSelector {
	NetworkHeightTipsetKey = 'networkHeightTipsetKey',
}

export default {
	entityType: EntityType.FilecoinTipset,

	label: 'Filecoin Tipset',
	labelPlural: 'Filecoin Tipsets',

	selectors: [
		{
			name: FilecoinTipsetSelector.NetworkHeightTipsetKey,
			fields: [
				'$network',
				'height',
				'tipsetKey',
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
			name: 'tipsetKey',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$parent',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinTipset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'parentWeight',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FilecoinBlock,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
