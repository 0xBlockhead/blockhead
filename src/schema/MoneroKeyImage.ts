// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum MoneroKeyImageSelector {
	MoneroTransactionInputIndexKeyImage = 'MoneroTransactionInputIndexKeyImage',
}
export default {
	entityType: EntityType.MoneroKeyImage,
	label: 'monero key image',
	labelPlural: 'monero key images',
	selectors: [
		{
			name: MoneroKeyImageSelector.MoneroTransactionInputIndexKeyImage,
			fields: [
				'$transaction',
				'inputIndex',
				'keyImage',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'Transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MoneroTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'inputIndex',
			label: 'Input index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'keyImage',
			label: 'Key image',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$ring',
			label: 'Ring',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MoneroRing,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
	],
} as const satisfies EntityDefinition
