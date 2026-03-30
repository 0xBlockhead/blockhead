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
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
