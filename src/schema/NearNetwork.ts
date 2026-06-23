import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum NearNetworkSelector {
	Slug = 'slug',
}
export default {
	entityType: EntityType.NearNetwork,
	label: 'near network',
	labelPlural: 'near networks',
	selectors: [
		{
			name: NearNetworkSelector.Slug,
			fields: [
				'slug',
			],
		},
	],
	fields: [
		{
			name: 'slug',
			label: 'Slug',
			description: 'A stable short name used by catalogs and URLs.',
			type: EntityFieldType.Primitive,
			primitiveType: type("'near'"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'namespace',
			label: 'Namespace',
			description: 'The namespace that qualifies the identifier.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'environment',
			label: 'environment',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'rpcEndpoints',
			label: 'RPC endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({"url": "string", "transportType": "string", "providerName": "string"}),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$blocks',
			label: 'blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearBlock,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$validators',
			label: 'validators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearValidator,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
