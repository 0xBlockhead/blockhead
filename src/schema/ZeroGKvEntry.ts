import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
	} from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import EvmAccount from '$/schema/EvmAccount.ts'
	import Network from '$/schema/Network.ts'

export default {
	entityType: EntityType.ZeroGKvEntry,

	label: '0G KV entry',
	labelPlural: '0G KV entries',

	id: type({
		$network: Network.id,
		namespace: 'string',
		key: 'string',
	}),

	fields: [
		{
			name: '$logEntry',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGStorageLogEntry,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			{
				name: '$owner',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				entityId: EvmAccount.id,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
		{
			name: 'valueHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
