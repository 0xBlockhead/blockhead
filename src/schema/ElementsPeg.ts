import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/ElementsNetwork.ts'
import { Source } from '$/sources/Source.ts'

export enum ElementsPegDirection {
	PegIn = 'PegIn',
	PegOut = 'PegOut',
}

export default {
	entityType: EntityType.ElementsPeg,

	label: 'Elements peg',
	labelPlural: 'Elements pegs',

	id: type({
		$network: Network.id,
		pegTransactionId: 'string',
		direction: type.valueOf(ElementsPegDirection),
	}),

	fields: [
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
