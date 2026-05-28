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
	entityType: EntityType.FilecoinTipset,

	label: 'Filecoin Tipset',
	labelPlural: 'Filecoin Tipsets',

	id: type({
		$network: Network.id,
		height: 'bigint',
		tipsetKey: 'string',
	}),

	fields: [
		{
			name: '$parent',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinTipset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'parentWeight',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FilecoinBlock,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
