import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import CashuMint from '$/schema/CashuMint.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.CashuKeyset,

	label: 'Cashu keyset',
	labelPlural: 'Cashu keysets',

	id: type({
		$mint: CashuMint.id,
		keysetId: 'string',
	}),

	fields: [
		{
			name: 'unit',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: 'active',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: 'inputFeePpk',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: 'keysByAmountJson',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
