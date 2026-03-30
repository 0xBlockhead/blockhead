import { type } from 'arktype'
import { Source } from '$/api/$Sources.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export enum ProposalType {
	Eip = 'Eip',
	Erc = 'Erc',
	Ensip = 'Ensip',
}

export enum ProposalRealm {
	ChainAgnostic = 'chain-agnostic',
	Ens = 'ens',
	Ethereum = 'ethereum',
}

export default {
	entityType: EntityType.Proposal,

	label: 'Proposal',

	id: type({
		kind: type.valueOf(ProposalType),
		number: 'number',
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
