import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import CosmosAccount from '$/schema/CosmosAccount.ts'
import Network from '$/schema/Network.ts'

export default {
	entityType: EntityType.CosmosModule,

	label: 'Cosmos Module',
	labelPlural: 'Cosmos Modules',

	id: type({
		$network: Network.id,
		moduleName: 'string',
	}),

	fields: [
		{
			name: '$authority',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosAccount,
			entityId: CosmosAccount.id,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
