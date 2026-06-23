import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ZeroGSettlementTraceSelector {
	ZeroGServiceRequestTraceId = 'zeroGServiceRequestTraceId',
	ServiceRequestTraceId = '$serviceRequest+traceId',
}
export default {
	entityType: EntityType.ZeroGSettlementTrace,
	label: 'zero g settlement trace',
	labelPlural: 'zero g settlement traces',
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
			label: 'service request',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGServiceRequest,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'traceId',
			label: 'trace ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'settlementTransactionHash',
			label: 'settlement transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'acknowledgementSignature',
			label: 'acknowledgement signature',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'rewardAmount',
			label: 'reward amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
