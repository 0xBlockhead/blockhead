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
	entityType: EntityType.CosmosContract,

	label: 'CosmWasm Contract',
	labelPlural: 'CosmWasm Contracts',

	id: type({
		$network: Network.id,
		address: 'string',
	}),

	fields: [
		{
			name: 'codeId',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$creator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$admin',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
