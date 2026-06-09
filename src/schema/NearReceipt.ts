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
	entityType: EntityType.NearReceipt,

	label: 'NEAR Receipt',
	labelPlural: 'NEAR Receipts',

	id: type({
		$network: Network.id,
		receiptId: 'string',
	}),

	fields: [
		{
			name: '$predecessor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$receiver',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
