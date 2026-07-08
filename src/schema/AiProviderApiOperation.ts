// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum AiProviderApiOperationSelector {
	ProviderOperationId = 'ProviderOperationId',
}
export const AiProviderApiOperation = entity({
	entityType: EntityType.AiProviderApiOperation,
	label: 'AI provider API operation',
	labelPlural: 'AI provider API operations',
})({
	$provider: {
		label: 'provider',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiModelProvider,
		cardinality: EntityFieldCardinality.One,
	},
	operationId: {
		label: 'operation ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	operationKind: {
		label: 'operation kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	httpMethod: {
		label: 'HTTP method',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pathTemplate: {
		label: 'path template',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	documentUrl: {
		label: 'document URL',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiProviderApiOperation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ProviderOperationId: [
			'$provider',
			'operationId',
		],
	},
})
