// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum A2aPushNotificationConfigSelector {
	TaskConfigId = 'TaskConfigId',
}
export default {
	entityType: EntityType.A2aPushNotificationConfig,
	label: 'a2a push notification config',
	labelPlural: 'a2a push notification configs',
	selectors: [
		{
			name: A2aPushNotificationConfigSelector.TaskConfigId,
			fields: [
				'$task',
				'configId',
			],
		},
	],
	fields: [
		{
				name: '$task',
				label: 'task',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.A2aTask,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'configId',
				label: 'config ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'url',
				label: 'URL',
				description: 'The URL for the source-domain resource.',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'authKind',
				label: 'auth kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'authentication',
				label: 'authentication',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'createdAt',
				label: 'Created',
				description: 'The time when the subject was created according to the source.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'deletedAt',
				label: 'deleted AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'status',
				label: 'status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
