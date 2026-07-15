// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum Eip8004EndpointDomainVerification_TimestampSelector {
	EndpointUrlTimestampMsSource = 'EndpointUrlTimestampMsSource',
}
export const Eip8004EndpointDomainVerification_Timestamp = entity({
	entityType: EntityType.Eip8004EndpointDomainVerification_Timestamp,
	labels: {
		singular: 'EIP-8004 endpoint domain verification timestamp',
		plural: 'EIP-8004 endpoint domain verification observations',
	},
})({
	endpointUrl: {
		label: 'Endpoint URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	verified: {
		label: 'Verified',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registrationSelector: {
		label: 'Registration selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'Error',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		EndpointUrlTimestampMsSource: [
			'endpointUrl',
			'timestampMs',
			'source',
		],
	},
})
