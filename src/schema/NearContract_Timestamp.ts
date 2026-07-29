// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NearContract_Timestamp,
	labels: {
		singular: 'near contract timestamp',
		plural: 'near contract observations',
	},
})({
	$contract: {
		label: 'Contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.NearContract,
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
	blockHeight: {
		label: 'Block height',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockHash: {
		label: 'Block hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	codeHash: {
		label: 'Code hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	codeSizeBytes: {
		label: 'Code size bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	codeBase64: {
		label: 'Code base64',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deployerTransactionHash: {
		label: 'Deployer transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ContractTimestampMsSource: [
			'$contract',
			'timestampMs',
			'source',
		],
	},
})
