import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum Eip8004AgentRegistrationSelector {
	NamespaceChainIdIdentityRegistryAgentId = 'namespace+chainId+identityRegistry+agentId',
}
export default {
	entityType: EntityType.Eip8004AgentRegistration,
	label: 'eip8004 agent registration',
	labelPlural: 'eip8004 agent registrations',
	selectors: [
		{
			name: Eip8004AgentRegistrationSelector.NamespaceChainIdIdentityRegistryAgentId,
			fields: [
				'namespace',
				'chainId',
				'identityRegistry',
				'agentId',
			],
		},
	],
	fields: [
		{
			name: 'namespace',
			label: 'Namespace',
			description: 'The namespace that qualifies the identifier.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'chainId',
			label: 'Chain ID',
			description: 'The chain identifier used by the network family.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'identityRegistry',
			label: 'identity registry',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'agentId',
			label: 'agent ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$evmNft',
			label: 'EVM NFT',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNft,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Eip8004AgentRegistration_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$files',
			label: 'files',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Eip8004AgentRegistrationFile,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
