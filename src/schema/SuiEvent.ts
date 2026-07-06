// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiEventSelector {
	NetworkTransactionDigestEventIndex = 'NetworkTransactionDigestEventIndex',
}
export default {
	entityType: EntityType.SuiEvent,
	label: 'sui event',
	labelPlural: 'sui events',
	selectors: [
		{
			name: SuiEventSelector.NetworkTransactionDigestEventIndex,
			fields: [
				'$network',
				'transactionDigest',
				'eventIndex',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SuiNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transactionDigest',
			label: 'transaction digest',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'eventIndex',
			label: 'event index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'eventType',
			label: 'event type',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'packageId',
			label: 'package ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'moduleName',
			label: 'module name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sender',
			label: 'sender',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'value',
			label: 'Value',
			description: 'The source-domain value.',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
