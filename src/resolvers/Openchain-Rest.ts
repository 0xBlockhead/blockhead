import type { EntityResolver } from '$/resolvers/$EntityResolver.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import type { Entity } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import {
	getOpenchainErrorEntries,
	getOpenchainEventEntries,
	getOpenchainFunctionEntries,
} from '$/sources/Openchain/Rest/queries.ts'
import type { OpenchainSignatureEntryWire } from '$/sources/Openchain/Rest/types.ts'
import { Source } from '$/sources/$Sources.ts'

const namesFromEntries = (entries: OpenchainSignatureEntryWire[]) => (
	entries.map((e) => e.name)
)

const evmSelectorResolver: EntityResolver<EntityType.EvmSelector> = {
	entityType: EntityType.EvmSelector,
	resolve: async (entityId) => {
		const entries = await singleFlight(getOpenchainFunctionEntries)({
			hex: entityId.hex,
		})
		return {
			signatures: namesFromEntries(entries),
		} satisfies Partial<Entity<EntityType.EvmSelector>>
	},
}

const evmTopicResolver: EntityResolver<EntityType.EvmTopic> = {
	entityType: EntityType.EvmTopic,
	resolve: async (entityId) => {
		const entries = await singleFlight(getOpenchainEventEntries)({
			hex: entityId.hex,
		})
		return {
			signatures: namesFromEntries(entries),
		} satisfies Partial<Entity<EntityType.EvmTopic>>
	},
}

const evmErrorResolver: EntityResolver<EntityType.EvmError> = {
	entityType: EntityType.EvmError,
	resolve: async (entityId) => {
		const entries = await singleFlight(getOpenchainErrorEntries)({
			hex: entityId.hex,
		})
		return {
			signatures: namesFromEntries(entries),
		} satisfies Partial<Entity<EntityType.EvmError>>
	},
}

export default {
	source: Source.Openchain,
	entityResolvers: [
		evmSelectorResolver,
		evmTopicResolver,
		evmErrorResolver,
	],
	entityFieldResolvers: [],
} satisfies {
	source: Source
	entityResolvers: readonly [
		typeof evmSelectorResolver,
		typeof evmTopicResolver,
		typeof evmErrorResolver,
	]
	entityFieldResolvers: readonly []
}
