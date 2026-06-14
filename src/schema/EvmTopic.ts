import { type } from 'arktype'

import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum EvmTopicSelector {
	Hex = 'hex',
}

export default {
	entityType: EntityType.EvmTopic,

	label: 'Log topic word',
	labelPlural: 'Log topic words',

	selectors: [
		{
			name: EvmTopicSelector.Hex,
			fields: [
				'hex',
			],
		},
	],

	fields: [
		{
			name: 'hex',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'signatures',
			type: EntityFieldType.Primitive,
			primitiveType: type('string[]'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Openchain_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
