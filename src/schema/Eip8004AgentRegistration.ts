// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Eip8004AgentRegistration,
	labels: {
		singular: 'EIP-8004 agent registration',
		plural: 'EIP-8004 agent registrations',
	},
})({
	namespace: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	chainId: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	identityRegistry: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	agentId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$evmNft: {
		entityType: EntityType.EvmNft,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.Eip8004AgentRegistration_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$files: {
		entityType: EntityType.Eip8004AgentRegistrationFile,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NamespaceChainIdIdentityRegistryAgentId: [
			'namespace',
			'chainId',
			'identityRegistry',
			'agentId',
		],
	},
})
