import type { ActionType } from '$/constants/actions.ts'
import type { WalletCandidate, WalletConnection } from '$/state/wallets/adapters/types.ts'
import { createAction } from '$/lib/createAction.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSession.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { Entity, EntitySelector } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { stringify } from 'devalue'

type LocalWriteCollection = {
	readonly utils: {
		writeUpsert(row: object): void
	}
}

type LocalDeleteCollection = {
	delete(key: string): void
}

export type LocalMutationContext = {
	readonly entityCollections: {
		readonly [EntityType.BlockheadSession]: LocalWriteCollection
		readonly [EntityType.BlockheadSessionAction]: LocalWriteCollection & LocalDeleteCollection
		readonly [EntityType.BlockheadWallet]: LocalWriteCollection
		readonly [EntityType.BlockheadWalletAccount]: LocalWriteCollection
		readonly [EntityType.BlockheadWalletConnection]: LocalWriteCollection & LocalDeleteCollection
		readonly [EntityType.EvmAccount]: LocalWriteCollection
	}
	readonly entityFieldCollections: {
		readonly [EntityType._Global]: {
			readonly $$actors: LocalWriteCollection
			readonly $$blockheadSessions: LocalWriteCollection
			readonly $$blockheadWallets: LocalWriteCollection
			readonly $$blockheadWalletAccounts: LocalWriteCollection
			readonly $$blockheadWalletConnections: LocalWriteCollection
		}
		readonly [EntityType.BlockheadSession]: {
			readonly $$actions: LocalWriteCollection & LocalDeleteCollection
			readonly name: LocalWriteCollection
			readonly status: LocalWriteCollection
		}
	}
	readonly entityFieldCountCollections: {
		readonly [EntityType.BlockheadWalletConnection]: {
			readonly $$connectedAccounts?: LocalWriteCollection & LocalDeleteCollection
		}
	}
}

export const writeLocalWatchedEvmAccount = (
	context: LocalMutationContext,
	accountEntitySelector: EntitySelector<typeof schema, EntityType.EvmAccount>,
) => {
	context.entityCollections[EntityType.EvmAccount].utils.writeUpsert({
		[EntityMetaKey.Selector]: accountEntitySelector,
		[EntityMetaKey.SelectorKey]: stringify(accountEntitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: {},
	})
	context.entityFieldCollections[EntityType._Global].$$actors.utils.writeUpsert({
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
	context: LocalMutationContext,
	parentEntitySelector: EntitySelector<typeof schema, EntityType._Global>,
	sessionName: string,
) => {
	const entitySelector = {
		id: `session-${Date.now()}`,
	}
	writeLocalBlockheadSessionName(context, entitySelector, sessionName)
	context.entityFieldCollections[EntityType._Global].$$blockheadSessions.utils.writeUpsert({
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

export const writeLocalBlockheadSessionName = (
	context: LocalMutationContext,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	sessionName: string,
) => {
	const now = Date.now()
	const fields = {
		...(sessionName.trim() !== '' && { name: sessionName.trim() }),
		status: BlockheadSessionStatus.Draft,
		createdAt: now,
		updatedAt: now,
	}
	context.entityCollections[EntityType.BlockheadSession].utils.writeUpsert({
		[EntityMetaKey.Selector]: entitySelector,
		[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
	if (fields.name != null)
		context.entityFieldCollections[EntityType.BlockheadSession].name.utils.writeUpsert({
			fieldName: 'name',
			[EntityMetaKey.ParentSelector]: entitySelector,
			[EntityMetaKey.ParentSelectorKey]: stringify(entitySelector),
			[EntityMetaKey.Source]: Source.Local_Internal,
			[EntityMetaKey.Value]: fields.name,
			valueKey: `Value:${stringify(fields.name)}`,
		})
	context.entityFieldCollections[EntityType.BlockheadSession].status.utils.writeUpsert({
		fieldName: 'status',
		[EntityMetaKey.ParentSelector]: entitySelector,
		[EntityMetaKey.ParentSelectorKey]: stringify(entitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: fields.status,
		valueKey: `Value:${stringify(fields.status)}`,
	})
}

export const writeLocalBlockheadSessionAction = (
	context: LocalMutationContext,
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
	context.entityCollections[EntityType.BlockheadSessionAction].utils.writeUpsert({
		[EntityMetaKey.Selector]: entitySelector,
		[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
	context.entityFieldCollections[EntityType.BlockheadSession].$$actions.utils.writeUpsert({
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
	context: LocalMutationContext,
	sessionEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSessionAction>,
) => {
	context.entityFieldCollections[EntityType.BlockheadSession].$$actions.delete(stringify([
		Source.Local_Internal,
		stringify(sessionEntitySelector),
		`Entity:${stringify(stringify(entitySelector))}`,
	]))
	context.entityCollections[EntityType.BlockheadSessionAction].delete(stringify([
		Source.Local_Internal,
		stringify(entitySelector),
	]))
}

export const updateLocalBlockheadSessionActionType = (
	context: LocalMutationContext,
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
	context.entityCollections[EntityType.BlockheadSessionAction].utils.writeUpsert({
		[EntityMetaKey.Selector]: entitySelector,
		[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
}

export const writeLocalBlockheadWallet = (
	context: LocalMutationContext,
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
	context.entityCollections[EntityType.BlockheadWallet].utils.writeUpsert({
		[EntityMetaKey.Selector]: entitySelector,
		[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
	context.entityFieldCollections[EntityType._Global].$$blockheadWallets.utils.writeUpsert({
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
	context: LocalMutationContext,
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

	context.entityCollections[EntityType.BlockheadWalletAccount].utils.writeUpsert({
		[EntityMetaKey.Selector]: entitySelector,
		[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
	context.entityFieldCollections[EntityType._Global].$$blockheadWalletAccounts.utils.writeUpsert({
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
	context: LocalMutationContext,
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
		writeLocalBlockheadWalletAccount(context, account)

	context.entityCollections[EntityType.BlockheadWalletConnection].utils.writeUpsert({
		[EntityMetaKey.Selector]: entitySelector,
		[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
	context.entityFieldCollections[EntityType._Global].$$blockheadWalletConnections.utils.writeUpsert({
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
	context.entityFieldCountCollections[EntityType.BlockheadWalletConnection].$$connectedAccounts?.utils.writeUpsert({
		[EntityMetaKey.ParentSelector]: entitySelector,
		[EntityMetaKey.ParentSelectorKey]: stringify(entitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: connection.accounts.length,
		fieldName: '$$connectedAccounts',
		filterKey: stringify({}),
	})
}

export const deleteLocalBlockheadWalletConnection = (
	context: LocalMutationContext,
	walletId: string,
) => {
	context.entityCollections[EntityType.BlockheadWalletConnection].delete(stringify([
		Source.Local_Internal,
		stringify({
			$wallet: {
				id: walletId,
			},
		}),
	]))
	context.entityFieldCountCollections[EntityType.BlockheadWalletConnection].$$connectedAccounts?.delete(stringify([
		Source.Local_Internal,
		stringify({
			$wallet: {
				id: walletId,
			},
		}),
		stringify({}),
	]))
}
