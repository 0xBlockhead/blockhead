// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum AlgorandBox_RoundSelector {
	BoxRoundSource = 'BoxRoundSource',
}
export default {
	entityType: EntityType.AlgorandBox_Round,
	label: 'algorand box round',
	labelPlural: 'algorand box rounds',
	selectors: [
		{
			name: AlgorandBox_RoundSelector.BoxRoundSource,
			fields: [
				'$box',
				'round',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$box',
				label: 'box',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AlgorandBox,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'round',
				label: 'round',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'value',
				label: 'Value',
				description: 'The source-domain value.',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'valueHash',
				label: 'value hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'deleted',
				label: 'deleted',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
