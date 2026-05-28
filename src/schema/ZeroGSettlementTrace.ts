import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import ZeroGServiceRequest from '$/schema/ZeroGServiceRequest.ts'

export default {
	entityType: EntityType.ZeroGSettlementTrace,

	label: '0G settlement trace',
	labelPlural: '0G settlement traces',

	id: type({
		$serviceRequest: ZeroGServiceRequest.id,
		traceId: 'string',
	}),

	fields: [
		{
			name: 'settlementTransactionHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'acknowledgementSignature',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'rewardAmount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
