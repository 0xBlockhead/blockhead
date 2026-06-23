import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EvmProtocolSelector {
	Scope = 'scope',
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
			description: 'The fixed scope value that identifies this hub row.',
			type: EntityFieldType.Primitive,
			primitiveType: type("'EvmProtocol'"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'protocolName',
			label: 'protocol name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'homeUrl',
			label: 'home URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'docsUrl',
			label: 'docs URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'registryLabel',
			label: 'registry label',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'topology',
			label: 'topology',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
