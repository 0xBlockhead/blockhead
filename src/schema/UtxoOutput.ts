import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Transaction from '$/schema/UtxoTransaction.ts'

export default {
	entityType: EntityType.UtxoOutput,

	label: 'UTXO Output',
	labelPlural: 'UTXO Outputs',

	id: type({
		$transaction: Transaction.id,
		outputIndex: 'number',
	}),

	fields: [
		{
			name: 'valueSats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'scriptPubKeyAsm',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'scriptPubKeyHex',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'scriptPubKeyType',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isSpent',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$bitcoinCashCashTokenFungibleAmount',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitcoinCashCashTokenFungibleAmount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$bitcoinCashCashTokenNft',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitcoinCashCashTokenNft,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
