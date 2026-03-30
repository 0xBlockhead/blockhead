import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export enum BlockheadAgentConversationTurnStatus {
	Pending = 'pending',
	Generating = 'generating',
	Complete = 'complete',
	Error = 'error',
	Cancelled = 'cancelled',
}

export default {
	entityType: EntityType.BlockheadAgentConversationTurn,

	label: 'Agent Conversation Turn',

	id: type({
		id: 'string',
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
