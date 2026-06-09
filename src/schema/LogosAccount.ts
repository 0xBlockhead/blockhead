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
	entityType: EntityType.LogosAccount,

	label: 'Logos Account',
	labelPlural: 'Logos Accounts',

	id: type({
		$network: Network.id,
		accountAddress: 'string',
	}),

	fields: [
		{
			name: '$zone',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LogosZone,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
