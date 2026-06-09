import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Transaction from '$/schema/UtxoTransaction.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.ElementsIssuance,

	label: 'Elements issuance',
	labelPlural: 'Elements issuances',

	id: type({
		$transaction: Transaction.id,
		inputIndex: 'number',
	}),

	fields: [
		{
			name: '$asset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ElementsAsset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: '$reissuanceTokenAsset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ElementsAsset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: 'assetEntropy',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: 'assetBlindingNonce',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: 'issuedAmount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: 'tokenAmount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: 'isReissuance',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
