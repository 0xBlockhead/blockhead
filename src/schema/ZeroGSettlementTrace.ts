import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import ZeroGServiceRequest from '$/schema/ZeroGServiceRequest.ts'

export enum ZeroGSettlementTraceSelector {
	ZeroGServiceRequestTraceId = 'zeroGServiceRequestTraceId',
}

export default {
	entityType: EntityType.ZeroGSettlementTrace,

	label: '0G settlement trace',
	labelPlural: '0G settlement traces',

	selectors: [
		{
			name: ZeroGSettlementTraceSelector.ZeroGServiceRequestTraceId,
			fields: [
				'$serviceRequest',
				'traceId',
			],
		},
	],

	fields: [
		{
			name: '$serviceRequest',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGServiceRequest,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'traceId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
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
