import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/Network.ts'

export default {
	entityType: EntityType.HyperliquidTransaction,

	label: 'Hyperliquid Transaction',
	labelPlural: 'Hyperliquid Transactions',

	id: type({
		$network: Network.id,
		txHash: 'string',
	}),

	fields: [
		{
			name: '$block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HyperliquidBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HyperliquidAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'actionType',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
