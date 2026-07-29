// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Eip8004AgentRegistration_Timestamp,
	labels: {
		singular: 'EIP-8004 agent registration timestamp',
		plural: 'EIP-8004 agent registration observations',
	},
})({
	$registration: {
		label: 'Registration',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Eip8004AgentRegistration,
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
	agentUri: {
		label: 'Agent URI',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ownerAddress: {
		label: 'Owner address',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	agentWalletAddress: {
		label: 'Agent wallet address',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	active: {
		label: 'Active',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockNumber: {
		label: 'Block number',
		description: 'The block height or number in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionHash: {
		label: 'Transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RegistrationTimestampMsSource: [
			'$registration',
			'timestampMs',
			'source',
		],
	},
})
