import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum MoneroKeyImageSelector {
	MoneroTransactionInputIndexKeyImage = 'moneroTransactionInputIndexKeyImage',
}

export default {
	entityType: EntityType.MoneroKeyImage,

	label: 'Monero Key Image',
	labelPlural: 'Monero Key Images',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MoneroTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'inputIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'keyImage',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$ring',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MoneroRing,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
