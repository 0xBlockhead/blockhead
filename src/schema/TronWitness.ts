import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum TronWitnessSelector {
	NetworkAddress = 'networkAddress',
}
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.TronWitness,

	label: 'TRON witness',
	labelPlural: 'TRON witnesses',

	selectors: [
		{
			name: TronWitnessSelector.NetworkAddress,
			fields: [
				'$network',
				'address',
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
			name: 'address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'url',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'voteCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'totalProduced',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'totalMissed',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'latestBlockHeight',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'active',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
