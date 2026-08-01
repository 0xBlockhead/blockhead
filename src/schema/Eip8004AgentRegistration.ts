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
		label: 'Namespace',
		description: 'The namespace that qualifies the identifier.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	chainId: {
		label: 'Chain ID',
		description: 'The chain identifier used by the network family.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	identityRegistry: {
		label: 'Identity registry',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	agentId: {
		label: 'Agent ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$evmNft: {
		label: 'EVM NFT',
		entityType: EntityType.EvmNft,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Timestamps',
		entityType: EntityType.Eip8004AgentRegistration_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$files: {
		label: 'Files',
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
