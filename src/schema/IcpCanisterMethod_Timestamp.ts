// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IcpCanisterMethod_Timestamp,
	labels: {
		singular: 'icp canister method timestamp',
		plural: 'icp canister method observations',
	},
})({
	$method: {
		label: 'method',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.IcpCanisterMethod,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	candidSignature: {
		label: 'candid signature',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	certifiedResponseSupported: {
		label: 'certified response supported',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestCount: {
		label: 'request count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		MethodTimestampMsSource: [
			'$method',
			'timestampMs',
			'source',
		],
	},
})
