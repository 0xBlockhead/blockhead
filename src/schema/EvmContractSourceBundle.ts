import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmContract from '$/schema/EvmContract.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.EvmContractSourceBundle,

	label: 'EVM contract source bundle',
	labelPlural: 'EVM contract source bundles',

	id: EvmContract.id,

	fields: [
		{
			name: 'files',
			type: EntityFieldType.Primitive,
			primitiveType: type.Record(type.string, type.string),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Sourcify_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
