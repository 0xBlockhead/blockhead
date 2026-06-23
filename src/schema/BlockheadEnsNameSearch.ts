import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadEnsNameSearchSelector {
	Query = 'query',
}
export default {
	entityType: EntityType.BlockheadEnsNameSearch,
	label: 'blockhead ENS name search',
	labelPlural: 'blockhead ENS name searches',
	selectors: [
		{
			name: BlockheadEnsNameSearchSelector.Query,
			fields: [
				'query',
			],
		},
	],
	fields: [
		{
			name: 'query',
			label: 'Query',
			description: 'ENSIP-15-normalized substring search text keyed in the selector for shareable `/ens?query=` URLs.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'resultLimit',
			label: 'result limit',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$matchingNames',
			label: 'matching names',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EnsName,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
