// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EnsNameSelector {
	NormalizedName = 'NormalizedName',
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
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'normalizedName',
				label: 'Normalized name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'node',
				label: 'Node',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'labelName',
				label: 'Label name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'labelhash',
				label: 'Label hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$parent',
				label: 'Parent',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EnsName,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$subdomains',
				label: 'Subdomains',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EnsName,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$resolverContract',
				label: 'Resolver contract',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmContract,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$subgraphResolvedActor',
				label: 'Resolved actor',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$ownerActor',
				label: 'Owner',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'textRecords',
				label: 'Text records',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'resolverTextKeys',
				label: 'Text record keys',
				type: EntityFieldType.Primitive,
				primitiveType: type('string').array(),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'resolverCoinTypes',
				label: 'Resolver coin types',
				type: EntityFieldType.Primitive,
				primitiveType: type('string').array(),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$records',
				label: 'Records',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EnsRecord,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EnsName_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
