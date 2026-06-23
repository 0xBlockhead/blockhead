import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum FedimintFederationSelector {
	FederationId = 'federationId',
}
export default {
	entityType: EntityType.FedimintFederation,
	label: 'Fedimint federation',
	labelPlural: 'Fedimint federations',
	selectors: [
		{
			name: FedimintFederationSelector.FederationId,
			fields: [
				'federationId',
			],
		},
	],
	fields: [
		{
			name: 'federationId',
			label: 'federation ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
			name: 'guardianCount',
			label: 'guardian count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'guardianThreshold',
			label: 'guardian threshold',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'clientConfigJson',
			label: 'client config JSON',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'moduleConfigJson',
			label: 'module config JSON',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'consensusVersion',
			label: 'consensus version',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FedimintFederation_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$gateways',
			label: 'gateways',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FedimintGateway,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
