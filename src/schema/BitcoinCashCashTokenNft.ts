import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import UtxoOutput from '$/schema/UtxoOutput.ts'

export default {
	entityType: EntityType.BitcoinCashCashTokenNft,

	label: 'Bitcoin Cash CashToken NFT',
	labelPlural: 'Bitcoin Cash CashToken NFTs',

	id: type({
		$output: UtxoOutput.id,
	}),

	fields: [
		{
			name: '$category',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitcoinCashCashTokenCategory,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$commitment',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitcoinCashCashTokenCommitment,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'capability',
			type: EntityFieldType.Primitive,
			primitiveType: type('"none" | "mutable" | "minting"'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
