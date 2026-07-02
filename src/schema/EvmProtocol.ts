// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmProtocolSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType.EvmProtocol,
	label: 'EVM protocol',
	labelPlural: 'EVM protocols',
	description: 'Catalog surface for EVM signature, topic, and error registries.',
	selectors: [
		{
			name: EvmProtocolSelector.Scope,
			fields: [
				'scope',
			],
		},
	],
	fields: [
		{
				name: 'scope',
				label: 'Scope',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'protocolName',
				label: 'Protocol name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'homeUrl',
				label: 'Home URL',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'docsUrl',
				label: 'Docs URL',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'registryLabel',
				label: 'Registry label',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'topology',
				label: 'Topology',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$evmTopics',
				label: 'EVM topics',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmTopic,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$evmSelectors',
				label: 'EVM selectors',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmSelector,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$evmErrors',
				label: 'EVM errors',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmError,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
