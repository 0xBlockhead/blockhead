import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'

export default {
	entityType: EntityType.HyperliquidAccount,

	label: 'Hyperliquid Account',
	labelPlural: 'Hyperliquid Accounts',

	id: type({
		$network: Network.id,
		address: 'string',
	}),

	fields: [
		{
			name: 'accountRole',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$masterAccount',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HyperliquidAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$agentAccount',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HyperliquidAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
