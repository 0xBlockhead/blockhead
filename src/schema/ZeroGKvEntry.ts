import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum ZeroGKvEntrySelector {
	NetworkNamespaceKey = 'networkNamespaceKey',
}

export default {
	entityType: EntityType.ZeroGKvEntry,

	label: '0G KV entry',
	labelPlural: '0G KV entries',

	selectors: [
		{
			name: ZeroGKvEntrySelector.NetworkNamespaceKey,
			fields: [
				'$network',
				'namespace',
				'key',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'namespace',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$logEntry',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGStorageLogEntry,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$owner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'valueHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
