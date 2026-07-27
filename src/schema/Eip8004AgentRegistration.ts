// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	chainId: {
		label: 'Chain ID',
		description: 'The chain identifier used by the network family.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	identityRegistry: {
		label: 'Identity registry',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	agentId: {
		label: 'Agent ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$evmNft: {
		label: 'EVM NFT',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmNft,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Eip8004AgentRegistration_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$files: {
		label: 'Files',
		type: EntityFieldType.EntitiesReference,
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
