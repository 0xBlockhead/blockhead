import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadRadicleSyncSessionSelector {
	SessionId = 'sessionId',
}
export default {
	entityType: EntityType.BlockheadRadicleSyncSession,
	label: 'blockhead radicle sync session',
	labelPlural: 'blockhead radicle sync sessions',
	selectors: [
		{
			name: BlockheadRadicleSyncSessionSelector.SessionId,
			fields: [
				'sessionId',
			],
		},
	],
	fields: [
		{
			name: 'sessionId',
			label: 'session ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$localNode',
			label: 'local node',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadRadicleNodeState,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'remoteNodeId',
			label: 'remote node ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$repository',
			label: 'repository',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RadicleRepository,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'rid',
			label: 'rid',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'startedAt',
			label: 'started AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'completedAt',
			label: 'completed AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'requestedRefs',
			label: 'requested refs',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'receivedObjects',
			label: 'received objects',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
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
