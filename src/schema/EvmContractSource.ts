import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import EvmContract from '$/schema/EvmContract.ts'

const metadata = type({
	'compiler?': 'string',
	'language?': 'string',
	'sources?': type.Record(type.string, type.unknown),
	'fullyQualifiedName?': 'string',
})

export default {
	entityType: EntityType.EvmContractSource,

	label: 'EVM Contract Source',

	id: EvmContract.id,

	fields: [
		{
			name: 'metadata',
			type: EntityFieldType.Primitive,
			primitiveType: metadata,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'files',
			type: EntityFieldType.Primitive,
			primitiveType: type.Record(type.string, type.string),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
