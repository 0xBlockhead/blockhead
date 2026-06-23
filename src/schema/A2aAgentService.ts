import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum A2aAgentServiceSelector {
	CardProtocolBindingEndpointUrl = '$card+protocolBinding+endpointUrl',
}
export default {
	entityType: EntityType.A2aAgentService,
	label: 'a2a agent service',
	labelPlural: 'a2a agent services',
	selectors: [
		{
			name: A2aAgentServiceSelector.CardProtocolBindingEndpointUrl,
			fields: [
				'$card',
				'protocolBinding',
				'endpointUrl',
			],
		},
	],
	fields: [
		{
			name: '$card',
			label: 'card',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.A2aAgentCard,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'protocolBinding',
			label: 'protocol binding',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'endpointUrl',
			label: 'endpoint URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transportKind',
			label: 'transport kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'authKind',
			label: 'auth kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$tasks',
			label: 'tasks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.A2aTask,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.A2aAgentService_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
