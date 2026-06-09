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
	entityType: EntityType.NearAccount,

	label: 'NEAR Account',
	labelPlural: 'NEAR Accounts',

	id: type({
		$network: Network.id,
		accountId: 'string',
	}),

	fields: [
		{
			name: 'amountYoctoNear',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'storageUsageBytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$accessKeys',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearAccessKey,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
