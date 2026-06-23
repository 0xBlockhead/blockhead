import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum Eip8004EndpointDomainVerification_TimestampSelector {
	EndpointUrlTimestampMsSource = 'endpointUrl+timestampMs+source',
}
export default {
	entityType: EntityType.Eip8004EndpointDomainVerification_Timestamp,
	label: 'eip8004 endpoint domain verification timestamp',
	labelPlural: 'eip8004 endpoint domain verification observations',
	selectors: [
		{
			name: Eip8004EndpointDomainVerification_TimestampSelector.EndpointUrlTimestampMsSource,
			fields: [
				'endpointUrl',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: 'endpointUrl',
			label: 'endpoint URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'verified',
			label: 'verified',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'registrationSelector',
			label: 'registration selector',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'error',
			label: 'error',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
