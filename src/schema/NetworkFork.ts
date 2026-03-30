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

	id: type({
		$network: Network.id,
		forkId: 'string',
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
