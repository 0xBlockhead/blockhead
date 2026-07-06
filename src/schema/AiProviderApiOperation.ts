// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum AiProviderApiOperationSelector {
	ProviderOperationId = 'ProviderOperationId',
}
export default {
	entityType: EntityType.AiProviderApiOperation,
	label: 'AI provider API operation',
	labelPlural: 'AI provider API operations',
	selectors: [
		{
			name: AiProviderApiOperationSelector.ProviderOperationId,
			fields: [
				'$provider',
				'operationId',
			],
		},
	],
	fields: [
		{
			name: '$provider',
			label: 'provider',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AiModelProvider,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'operationId',
			label: 'operation ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'operationKind',
			label: 'operation kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'httpMethod',
			label: 'HTTP method',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'pathTemplate',
			label: 'path template',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'documentUrl',
			label: 'document URL',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AiProviderApiOperation_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
