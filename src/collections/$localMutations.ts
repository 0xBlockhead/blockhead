import type { ActionType } from '$/constants/actions.ts'
import { createAction } from '$/lib/createAction.ts'
import { entityFieldCollectionItemKey } from '$/collections/$collections.ts'
import {
	entityCollectionByEntityType,
	entityFieldCollections,
} from '$/collections/$entityCollections.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSession.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { Entity, EntityId } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { Source } from '$/sources/$Source.ts'
import { stringify } from 'devalue'

export const writeLocalWatchedEvmAccount = (accountEntityId: EntityId<typeof schema, EntityType.EvmAccount>) => {
	entityCollectionByEntityType[EntityType.EvmAccount].utils.writeUpsert({
		[EntityMetaKey.Id]: accountEntityId,
		[EntityMetaKey.IdKey]: stringify(accountEntityId),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: {},
	})
	entityFieldCollections[EntityType._Global].$$actors.utils.writeUpsert({
		[EntityMetaKey.ParentId]: { scope: '$$actors' },
		[EntityMetaKey.ParentIdKey]: stringify({ scope: '$$actors' }),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Id]: accountEntityId,
			[EntityMetaKey.IdKey]: stringify(accountEntityId),
		},
	})
}

export const writeLocalBlockheadSession = (
	parentEntityId: EntityId<typeof schema, EntityType._Global>,
	sessionName: string,
) => {
	const now = Date.now()
	const entityId = {
		id: `session-${now}`,
	}
	const fields = {
		...(sessionName.trim() !== '' && { name: sessionName.trim() }),
		status: BlockheadSessionStatus.Draft,
		createdAt: now,
		updatedAt: now,
	}
	entityCollectionByEntityType[EntityType.BlockheadSession].utils.writeUpsert({
		[EntityMetaKey.Id]: entityId,
		[EntityMetaKey.IdKey]: stringify(entityId),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
	entityFieldCollections[EntityType._Global].$$blockheadSessions.utils.writeUpsert({
		[EntityMetaKey.ParentId]: parentEntityId,
		[EntityMetaKey.ParentIdKey]: stringify(parentEntityId),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Id]: entityId,
			[EntityMetaKey.IdKey]: stringify(entityId),
		},
	})
}

const blockheadSessionActionEntityId = (
	sessionEntityId: EntityId<typeof schema, EntityType.BlockheadSession>,
	actionId: string,
) => ({
	sessionId: sessionEntityId.id,
	actionId,
})

const writeLocalBlockheadSessionActionReference = (
	sessionEntityId: EntityId<typeof schema, EntityType.BlockheadSession>,
	entityId: ReturnType<typeof blockheadSessionActionEntityId>,
) => {
	entityFieldCollections[EntityType.BlockheadSession].$$actions.utils.writeUpsert({
		[EntityMetaKey.ParentId]: sessionEntityId,
		[EntityMetaKey.ParentIdKey]: stringify(sessionEntityId),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Id]: entityId,
			[EntityMetaKey.IdKey]: stringify(entityId),
		},
	})
}

export const writeLocalBlockheadSessionAction = (
	sessionEntityId: EntityId<typeof schema, EntityType.BlockheadSession>,
	indexInSequence: number,
	actionType: ActionType,
) => {
	const now = Date.now()
	const entityId = blockheadSessionActionEntityId(sessionEntityId, `${now}`)
	const fields = {
		$session: {
			[EntityMetaKey.Id]: sessionEntityId,
		},
		indexInSequence,
		action: createAction(actionType),
		createdAt: now,
		updatedAt: now,
	}
	entityCollectionByEntityType[EntityType.BlockheadSessionAction].utils.writeUpsert({
		[EntityMetaKey.Id]: entityId,
		[EntityMetaKey.IdKey]: stringify(entityId),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
	writeLocalBlockheadSessionActionReference(sessionEntityId, entityId)
}

export const deleteLocalBlockheadSessionAction = (
	sessionEntityId: EntityId<typeof schema, EntityType.BlockheadSession>,
	entityId: EntityId<typeof schema, EntityType.BlockheadSessionAction>,
) => {
	entityFieldCollections[EntityType.BlockheadSession].$$actions.delete(entityFieldCollectionItemKey({
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.ParentIdKey]: stringify(sessionEntityId),
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Id]: entityId,
			[EntityMetaKey.IdKey]: stringify(entityId),
		},
	}))
	entityCollectionByEntityType[EntityType.BlockheadSessionAction].delete([
		Source.Local_Internal,
		stringify(entityId),
	].join('\x1E'))
}

export const updateLocalBlockheadSessionActionType = (
	entityId: EntityId<typeof schema, EntityType.BlockheadSessionAction>,
	sessionAction: Entity<typeof schema, EntityType.BlockheadSessionAction>,
	actionType: ActionType,
) => {
	const fields = {
		$session: sessionAction.$session,
		indexInSequence: sessionAction.indexInSequence,
		action: createAction(actionType),
		createdAt: sessionAction.createdAt,
		updatedAt: Date.now(),
	}
	entityCollectionByEntityType[EntityType.BlockheadSessionAction].utils.writeUpsert({
		[EntityMetaKey.Id]: entityId,
		[EntityMetaKey.IdKey]: stringify(entityId),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
}
