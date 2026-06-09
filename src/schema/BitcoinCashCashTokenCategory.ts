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
	entityType: EntityType.BitcoinCashCashTokenCategory,

	label: 'Bitcoin Cash CashToken Category',
	labelPlural: 'Bitcoin Cash CashToken Categories',

	id: type({
		$network: Network.id,
		categoryId: 'string',
	}),

	fields: [
		{
			name: '$metadata',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitcoinCashBcmrMetadata,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
