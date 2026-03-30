import { type } from 'arktype'
import {
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.XmtpConversation,

	label: 'XMTP Conversation',

	id: type({
		id: 'string',
	}),

	fields: [] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
