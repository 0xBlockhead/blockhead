import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.EvmProtocol,

	label: 'EVM protocol',
	labelPlural: 'EVM protocols',

	id: type({
		scope: type.unit('EvmProtocol'),
	}),

	fields: [
		{
			name: 'protocolName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'homeUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'docsUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'registryLabel',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'topology',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$evmTopics',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTopic,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Local_Internal],
		},
		{
			name: '$$evmSelectors',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmSelector,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Local_Internal],
		},
		{
			name: '$$evmErrors',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmError,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Local_Internal],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
