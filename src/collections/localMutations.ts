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
import type { Entity, EntitySelector } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { stringify } from 'devalue'

export const writeLocalWatchedEvmAccount = (accountEntitySelector: EntitySelector<typeof schema, EntityType.EvmAccount>) => {
	entityCollectionByEntityType[EntityType.EvmAccount].utils.writeUpsert({
		[EntityMetaKey.Selector]: accountEntitySelector,
		[EntityMetaKey.SelectorKey]: stringify(accountEntitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: {},
	})
	entityFieldCollections[EntityType._Global].$$actors.utils.writeUpsert({
		fieldName: '$$actors',
		[EntityMetaKey.ParentSelector]: { scope: '$$actors' },
		[EntityMetaKey.ParentSelectorKey]: stringify({ scope: '$$actors' }),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Selector]: accountEntitySelector,
			[EntityMetaKey.SelectorKey]: stringify(accountEntitySelector),
		},
		valueKey: `Entity:${stringify(stringify(accountEntitySelector))}`,
	})
}

export const writeLocalBlockheadSession = (
	parentEntitySelector: EntitySelector<typeof schema, EntityType._Global>,
	sessionName: string,
) => {
	const now = Date.now()
	const entitySelector = {
		id: `session-${now}`,
	}
	const fields = {
		...(sessionName.trim() !== '' && { name: sessionName.trim() }),
		status: BlockheadSessionStatus.Draft,
		createdAt: now,
		updatedAt: now,
	}
	entityCollectionByEntityType[EntityType.BlockheadSession].utils.writeUpsert({
		[EntityMetaKey.Selector]: entitySelector,
		[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
	entityFieldCollections[EntityType._Global].$$blockheadSessions.utils.writeUpsert({
		fieldName: '$$blockheadSessions',
		[EntityMetaKey.ParentSelector]: parentEntitySelector,
		[EntityMetaKey.ParentSelectorKey]: stringify(parentEntitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Selector]: entitySelector,
			[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		},
		valueKey: `Entity:${stringify(stringify(entitySelector))}`,
	})
}

export const writeLocalBlockheadSessionAction = (
	sessionEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	indexInSequence: number,
	actionType: ActionType,
) => {
	const now = Date.now()
	const entitySelector = {
		sessionId: sessionEntitySelector.id,
		actionId: `${now}`,
	}
	const fields = {
		$session: {
			[EntityMetaKey.Selector]: sessionEntitySelector,
		},
		indexInSequence,
		action: createAction(actionType),
		createdAt: now,
		updatedAt: now,
	}
	entityCollectionByEntityType[EntityType.BlockheadSessionAction].utils.writeUpsert({
		[EntityMetaKey.Selector]: entitySelector,
		[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
	entityFieldCollections[EntityType.BlockheadSession].$$actions.utils.writeUpsert({
		fieldName: '$$actions',
		[EntityMetaKey.ParentSelector]: sessionEntitySelector,
		[EntityMetaKey.ParentSelectorKey]: stringify(sessionEntitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Selector]: entitySelector,
			[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		},
		valueKey: `Entity:${stringify(stringify(entitySelector))}`,
	})
}

export const deleteLocalBlockheadSessionAction = (
	sessionEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSessionAction>,
) => {
	entityFieldCollections[EntityType.BlockheadSession].$$actions.delete(stringify([
		Source.Local_Internal,
		stringify(sessionEntitySelector),
		`Entity:${stringify(stringify(entitySelector))}`,
	]))
	entityCollectionByEntityType[EntityType.BlockheadSessionAction].delete(stringify([
		Source.Local_Internal,
		stringify(entitySelector),
	]))
}

export const updateLocalBlockheadSessionActionType = (
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSessionAction>,
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
		[EntityMetaKey.Selector]: entitySelector,
		[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
}

export const writeLocalBlockheadWallet = (
	candidate: WalletCandidate,
) => {
	const entitySelector = {
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
		[EntityMetaKey.Selector]: entitySelector,
		[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
	entityFieldCollections[EntityType._Global].$$blockheadWallets.utils.writeUpsert({
		fieldName: '$$blockheadWallets',
		[EntityMetaKey.ParentSelector]: { scope: '$$blockheadWallets' },
		[EntityMetaKey.ParentSelectorKey]: stringify({ scope: '$$blockheadWallets' }),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Selector]: entitySelector,
			[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		},
		valueKey: `Entity:${stringify(stringify(entitySelector))}`,
	})
}

export const writeLocalBlockheadWalletAccount = (
	account: WalletConnection['accounts'][number],
) => {
	const entitySelector = {
		caip10: {
			namespace: account.namespace,
			reference: account.reference,
			accountAddress: account.accountAddress,
		},
	}
	const fields = {
		$network: {
			[EntityMetaKey.Selector]: {
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
		[EntityMetaKey.Selector]: entitySelector,
		[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
	entityFieldCollections[EntityType._Global].$$blockheadWalletAccounts.utils.writeUpsert({
		fieldName: '$$blockheadWalletAccounts',
		[EntityMetaKey.ParentSelector]: { scope: '$$blockheadWalletAccounts' },
		[EntityMetaKey.ParentSelectorKey]: stringify({ scope: '$$blockheadWalletAccounts' }),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Selector]: entitySelector,
			[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		},
		valueKey: `Entity:${stringify(stringify(entitySelector))}`,
	})
}

export const writeLocalBlockheadWalletConnection = (
	connection: WalletConnection,
) => {
	const activeAccount = connection.accounts.at(0)
	const entitySelector = {
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
			[EntityMetaKey.Selector]: {
				caip10: {
					namespace: account.namespace,
					reference: account.reference,
					accountAddress: account.accountAddress,
				},
			},
		})),
		...(activeAccount != null && {
			$activeAccount: {
				[EntityMetaKey.Selector]: {
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
		[EntityMetaKey.Selector]: entitySelector,
		[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
	entityFieldCollections[EntityType._Global].$$blockheadWalletConnections.utils.writeUpsert({
		fieldName: '$$blockheadWalletConnections',
		[EntityMetaKey.ParentSelector]: { scope: '$$blockheadWalletConnections' },
		[EntityMetaKey.ParentSelectorKey]: stringify({ scope: '$$blockheadWalletConnections' }),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Selector]: entitySelector,
			[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		},
		valueKey: `Entity:${stringify(stringify(entitySelector))}`,
	})
	entityFieldCountCollections[EntityType.BlockheadWalletConnection].$$connectedAccounts?.utils.writeUpsert({
		[EntityMetaKey.ParentSelector]: entitySelector,
		[EntityMetaKey.ParentSelectorKey]: stringify(entitySelector),
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
