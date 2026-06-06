import { type } from 'arktype'

import { UrlString } from '$/schema/$Url.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.PayjoinDirectory,

	label: 'Payjoin directory',
	labelPlural: 'Payjoin directories',

	id: type({
		directoryUrl: UrlString,
	}),

	fields: [
		{
			name: 'ohttpGatewayUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.PayjoinDirectory_Rest,
			],
		},
		{
			name: 'ohttpKeyConfig',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.PayjoinDirectory_Rest,
			],
		},
		{
			name: 'maxPayloadBytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.PayjoinDirectory_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
