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
	entityType: EntityType.FilecoinMessage,

	label: 'Filecoin Message',
	labelPlural: 'Filecoin Messages',

	id: type({
		$network: Network.id,
		cid: 'string',
	}),

	fields: [
		{
			name: '$from',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$to',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'method',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'valueAttoFil',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gasLimit',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
