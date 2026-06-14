import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum ElementsPegSelector {
	ElementsNetworkPegTransactionIdDirection = 'elementsNetworkPegTransactionIdDirection',
}


export enum ElementsPegDirection {
	PegIn = 'PegIn',
	PegOut = 'PegOut',
}

export default {
	entityType: EntityType.ElementsPeg,

	label: 'Elements peg',
	labelPlural: 'Elements pegs',

	selectors: [
		{
			name: ElementsPegSelector.ElementsNetworkPegTransactionIdDirection,
			fields: [
				'$network',
				'pegTransactionId',
				'direction',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ElementsNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pegTransactionId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'direction',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(ElementsPegDirection),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$bitcoinTransaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: '$elementsTransaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: 'amountSats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: 'claimScript',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: 'pakProof',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
