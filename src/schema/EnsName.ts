import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EnsNameSelector {
	NormalizedName = 'normalizedName',
	Name = 'name',
}
export default {
	entityType: EntityType.EnsName,
	label: 'ENS name',
	labelPlural: 'ENS names',
	selectors: [
		{
			name: EnsNameSelector.NormalizedName,
			fields: [
				'name',
			],
		},
	],
	fields: [
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'normalizedName',
			label: 'normalized name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'node',
			label: 'node',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'labelName',
			label: 'label name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'labelhash',
			label: 'labelhash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$parent',
			label: 'parent',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EnsName,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$subdomains',
			label: 'subdomains',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EnsName,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EnsName_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$records',
			label: 'records',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EnsRecord,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$reverseRecords',
			label: 'reverse records',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EnsReverseRecord,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
