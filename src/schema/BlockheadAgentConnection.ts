import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadAgentConnectionSelector {
	ConnectionId = 'connectionId',
}
export default {
	entityType: EntityType.BlockheadAgentConnection,
	label: 'blockhead agent connection',
	labelPlural: 'blockhead agent connections',
	selectors: [
		{
			name: BlockheadAgentConnectionSelector.ConnectionId,
			fields: [
				'connectionId',
			],
		},
	],
	fields: [
		{
			name: 'connectionId',
			label: 'connection ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$profile',
			label: 'profile',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadAgentProfile,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadSource,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'connectionKind',
			label: 'connection kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'endpointUrl',
			label: 'endpoint URL',
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
			name: 'enabled',
			label: 'enabled',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadAgentConnection_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
