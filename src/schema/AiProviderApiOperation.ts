// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AiProviderApiOperation,
	labels: {
		singular: 'AI provider API operation',
		plural: 'AI provider API operations',
	},
})({
	$provider: {
		label: 'provider',
		entityType: EntityType.AiModelProvider,
		cardinality: EntityFieldCardinality.One,
	},
	operationId: {
		label: 'operation ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	operationKind: {
		label: 'operation kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	httpMethod: {
		label: 'HTTP method',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pathTemplate: {
		label: 'path template',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	documentUrl: {
		label: 'document URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
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
