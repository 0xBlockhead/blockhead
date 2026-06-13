import type { ActionType } from '$/constants/actions.ts'
import type { WalletCandidate, WalletConnection } from '$/state/wallets/adapters/types.ts'
import { createAction } from '$/lib/createAction.ts'
import {
	entityCollectionByEntityType,
	entityFieldCollections,
	entityFieldCountCollections,
} from '$/routes/+layout.svelte'
import { BlockheadSessionStatus } from '$/schema/BlockheadSession.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { Entity, EntityId } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { stringify } from 'devalue'

export const writeLocalWatchedEvmAccount = (accountEntityId: EntityId<typeof schema, EntityType.EvmAccount>) => {
	entityCollectionByEntityType[EntityType.EvmAccount].utils.writeUpsert({
		[EntityMetaKey.Id]: accountEntityId,
		[EntityMetaKey.IdKey]: stringify(accountEntityId),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: {},
	})
	entityFieldCollections[EntityType._Global].$$actors.utils.writeUpsert({
		fieldName: '$$actors',
		[EntityMetaKey.ParentId]: { scope: '$$actors' },
		[EntityMetaKey.ParentIdKey]: stringify({ scope: '$$actors' }),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Id]: accountEntityId,
			[EntityMetaKey.IdKey]: stringify(accountEntityId),
		},
		valueKey: `Entity:${stringify(stringify(accountEntityId))}`,
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
		fieldName: '$$blockheadSessions',
		[EntityMetaKey.ParentId]: parentEntityId,
		[EntityMetaKey.ParentIdKey]: stringify(parentEntityId),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Id]: entityId,
			[EntityMetaKey.IdKey]: stringify(entityId),
		},
		valueKey: `Entity:${stringify(stringify(entityId))}`,
	})
}

export const writeLocalBlockheadSessionAction = (
	sessionEntityId: EntityId<typeof schema, EntityType.BlockheadSession>,
	indexInSequence: number,
	actionType: ActionType,
) => {
	const now = Date.now()
	const entityId = {
		sessionId: sessionEntityId.id,
		actionId: `${now}`,
	}
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
	entityFieldCollections[EntityType.BlockheadSession].$$actions.utils.writeUpsert({
		fieldName: '$$actions',
		[EntityMetaKey.ParentId]: sessionEntityId,
		[EntityMetaKey.ParentIdKey]: stringify(sessionEntityId),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Id]: entityId,
			[EntityMetaKey.IdKey]: stringify(entityId),
		},
		valueKey: `Entity:${stringify(stringify(entityId))}`,
	})
}

export const deleteLocalBlockheadSessionAction = (
	sessionEntityId: EntityId<typeof schema, EntityType.BlockheadSession>,
	entityId: EntityId<typeof schema, EntityType.BlockheadSessionAction>,
) => {
	entityFieldCollections[EntityType.BlockheadSession].$$actions.delete(stringify([
		Source.Local_Internal,
		stringify(sessionEntityId),
		`Entity:${stringify(stringify(entityId))}`,
	]))
	entityCollectionByEntityType[EntityType.BlockheadSessionAction].delete(stringify([
		Source.Local_Internal,
		stringify(entityId),
	]))
}

export const updateLocalBlockheadSessionActionType = (
	entityId: EntityId<typeof schema, EntityType.BlockheadSessionAction>,
	sessionAction: Pick<
		Entity<typeof schema, EntityType.BlockheadSessionAction>,
		| '$session'
		| 'indexInSequence'
		| 'createdAt'
	>,
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

export const writeLocalBlockheadWallet = (
	candidate: WalletCandidate,
) => {
	const entityId = {
		id: candidate.id,
	}
	const fields = {
		name: candidate.name,
		icon: candidate.icon,
		protocol: candidate.protocol,
		discoveryKind: candidate.discoveryKind,
		transportKind: candidate.transportKind,
		...(candidate.rdns != null && { rdns: candidate.rdns }),
		capabilities: candidate.capabilities,
	}
	entityCollectionByEntityType[EntityType.BlockheadWallet].utils.writeUpsert({
		[EntityMetaKey.Id]: entityId,
		[EntityMetaKey.IdKey]: stringify(entityId),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
	entityFieldCollections[EntityType._Global].$$blockheadWallets.utils.writeUpsert({
		fieldName: '$$blockheadWallets',
		[EntityMetaKey.ParentId]: { scope: '$$blockheadWallets' },
		[EntityMetaKey.ParentIdKey]: stringify({ scope: '$$blockheadWallets' }),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Id]: entityId,
			[EntityMetaKey.IdKey]: stringify(entityId),
		},
		valueKey: `Entity:${stringify(stringify(entityId))}`,
	})
}

export const writeLocalBlockheadWalletAccount = (
	account: WalletConnection['accounts'][number],
) => {
	const entityId = {
		caip10: {
			namespace: account.namespace,
			reference: account.reference,
			accountAddress: account.accountAddress,
		},
	}
	const fields = {
		$network: {
			[EntityMetaKey.Id]: {
				caip2: {
					namespace: account.namespace,
					reference: account.reference,
				},
			},
		},
		address: account.accountAddress,
		capabilities: account.capabilities,
	}

	entityCollectionByEntityType[EntityType.BlockheadWalletAccount].utils.writeUpsert({
		[EntityMetaKey.Id]: entityId,
		[EntityMetaKey.IdKey]: stringify(entityId),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
	entityFieldCollections[EntityType._Global].$$blockheadWalletAccounts.utils.writeUpsert({
		fieldName: '$$blockheadWalletAccounts',
		[EntityMetaKey.ParentId]: { scope: '$$blockheadWalletAccounts' },
		[EntityMetaKey.ParentIdKey]: stringify({ scope: '$$blockheadWalletAccounts' }),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Id]: entityId,
			[EntityMetaKey.IdKey]: stringify(entityId),
		},
		valueKey: `Entity:${stringify(stringify(entityId))}`,
	})
}

export const writeLocalBlockheadWalletConnection = (
	connection: WalletConnection,
) => {
	const activeAccount = connection.accounts.at(0)
	const entityId = {
		$wallet: {
			id: connection.walletId,
		},
	}
	const fields = {
		status: connection.status,
		protocol: connection.protocol,
		transportKind: connection.transportKind,
		scopes: connection.scopes,
		$$connectedAccounts: connection.accounts.map((account) => ({
			[EntityMetaKey.Id]: {
				caip10: {
					namespace: account.namespace,
					reference: account.reference,
					accountAddress: account.accountAddress,
				},
			},
		})),
		...(activeAccount != null && {
			$activeAccount: {
				[EntityMetaKey.Id]: {
					caip10: {
						namespace: activeAccount.namespace,
						reference: activeAccount.reference,
						accountAddress: activeAccount.accountAddress,
					},
				},
			},
		}),
		selected: connection.selected,
		connectedAt: connection.connectedAt,
		...(connection.error != null && { error: connection.error }),
	}

	for (const account of connection.accounts)
		writeLocalBlockheadWalletAccount(account)

	entityCollectionByEntityType[EntityType.BlockheadWalletConnection].utils.writeUpsert({
		[EntityMetaKey.Id]: entityId,
		[EntityMetaKey.IdKey]: stringify(entityId),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
	entityFieldCollections[EntityType._Global].$$blockheadWalletConnections.utils.writeUpsert({
		fieldName: '$$blockheadWalletConnections',
		[EntityMetaKey.ParentId]: { scope: '$$blockheadWalletConnections' },
		[EntityMetaKey.ParentIdKey]: stringify({ scope: '$$blockheadWalletConnections' }),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Id]: entityId,
			[EntityMetaKey.IdKey]: stringify(entityId),
		},
		valueKey: `Entity:${stringify(stringify(entityId))}`,
	})
	entityFieldCountCollections[EntityType.BlockheadWalletConnection].$$connectedAccounts?.utils.writeUpsert({
		[EntityMetaKey.ParentId]: entityId,
		[EntityMetaKey.ParentIdKey]: stringify(entityId),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: connection.accounts.length,
		fieldName: '$$connectedAccounts',
		filterKey: stringify({}),
	})
}

export const deleteLocalBlockheadWalletConnection = (
	walletId: string,
) => {
	entityCollectionByEntityType[EntityType.BlockheadWalletConnection].delete(stringify([
		Source.Local_Internal,
		stringify({
			$wallet: {
				id: walletId,
			},
		}),
	]))
	entityFieldCountCollections[EntityType.BlockheadWalletConnection].$$connectedAccounts?.delete(stringify([
		Source.Local_Internal,
		stringify({
			$wallet: {
				id: walletId,
			},
		}),
		stringify({}),
	]))
}
