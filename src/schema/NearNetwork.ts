// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NearNetworkSelector {
	Slug = 'Slug',
}
export default {
	entityType: EntityType.NearNetwork,
	label: 'near network',
	labelPlural: 'near networks',
	description: 'NEAR network catalog row with RPC endpoints, runtime observations, blocks, and validator sets from declared NEAR sources.',
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
			primitiveType: type.unit('near'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'namespace',
			label: 'Namespace',
			description: 'The namespace that qualifies the identifier.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'environment',
			label: 'Environment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'rpcEndpoints',
			label: 'RPC endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: '$$blocks',
			label: 'Blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearBlock,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: '$$validators',
			label: 'Validators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearValidator,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
	],
} as const satisfies EntityDefinition
