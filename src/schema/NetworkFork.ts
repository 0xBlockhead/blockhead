import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/Network.ts'

export enum ForkScheduleKind {
	Execution = 'execution',
	Consensus = 'consensus',
	Blob = 'blob',
}

export enum ExecutionProtocol {
	Ethereum = 'Ethereum',
	OpStack = 'OpStack',
	PolygonBor = 'PolygonBor',
	ArbitrumNitro = 'ArbitrumNitro',
	Other = 'Other',
}

export enum ConsensusProtocol {
	EthereumBeacon = 'EthereumBeacon',
}

export default {
	entityType: EntityType.NetworkFork,

	label: 'Network Fork',
	labelPlural: 'Network Forks',

	id: type({
		$network: Network.id,
		forkId: 'string',
	}),

	fields: [
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slug',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'activationBlock',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activationTimestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activationEpoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'forkHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'kind',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(ForkScheduleKind),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'executionProtocol',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(ExecutionProtocol),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'consensusProtocol',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(ConsensusProtocol),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'linkEthereumOrg',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'linkExecutionDocs',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'linkConsensusDocs',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'linkForkcast',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$proposals',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Proposal,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
