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
	entityType: EntityType.QuilibriumAccount,

	label: 'Quilibrium Account',
	labelPlural: 'Quilibrium Accounts',

	id: type({
		$network: Network.id,
		accountAddress: 'string',
	}),

	fields: [
		{
			name: 'accountKind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
