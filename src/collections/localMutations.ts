import {
	type ActionType,
	actionTypeDefinitionByActionType,
} from '$/constants/actions.ts'
import type { WalletCandidate, WalletConnection } from '$/state/wallets/adapters/types.ts'
import type { EntityCollectionsContext } from '$/client/$client.svelte.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSession.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { Entity, EntitySelector } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { stringify } from 'devalue'

export type LocalMutationContext = Pick<
	EntityCollectionsContext<typeof schema>,
	| 'entityCollections'
	| 'entityFieldCollections'
	| 'entityFieldCountCollections'
>

type LocalPrimitiveFieldValue = object | string | number | boolean | bigint

const writeLocalPresence = (
	context: LocalMutationContext,
	entityType: EntityType,
	entitySelector: object
) => {
	context.entityCollections[entityType].utils.writeUpsert({
		[EntityMetaKey.Selector]: entitySelector,
		[EntityMetaKey.SelectorKey]: stringify(entitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
	})
}

const writeLocalPrimitiveFields = (
	context: LocalMutationContext,
	entityType: EntityType,
	entitySelector: object,
	fields: Record<string, LocalPrimitiveFieldValue | undefined>
) => {
	Object.entries(fields).forEach(([fieldName, value]) => {
		if (value !== undefined)
			context.entityFieldCollections[entityType][fieldName].utils.writeUpsert({
				fieldName,
				[EntityMetaKey.ParentSelector]: entitySelector,
				[EntityMetaKey.ParentSelectorKey]: stringify(entitySelector),
				[EntityMetaKey.Source]: Source.Local_Internal,
				[EntityMetaKey.Value]: value,
				valueKey: `Value:${stringify(value)}`,
			})
	})
}

const writeLocalEntityReferenceField = (
	context: LocalMutationContext,
	entityType: EntityType,
	entitySelector: object,
	fieldName: string,
	referencedEntitySelector: object,
	valueIndex?: number
) => {
	context.entityFieldCollections[entityType][fieldName].utils.writeUpsert({
		fieldName,
		...(valueIndex !== undefined && {
			valueIndex,
		}),
		[EntityMetaKey.ParentSelector]: entitySelector,
		[EntityMetaKey.ParentSelectorKey]: stringify(entitySelector),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Selector]: referencedEntitySelector,
			[EntityMetaKey.SelectorKey]: stringify(referencedEntitySelector),
		},
		valueKey: `Entity:${stringify(stringify(referencedEntitySelector))}`,
	})
}

export const writeLocalWatchedEvmAccount = (
	context: LocalMutationContext,
	accountEntitySelector: EntitySelector<typeof schema, EntityType.EvmAccount>
) => {
	writeLocalPresence(context, EntityType.EvmAccount, accountEntitySelector)
	writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$actors' },
		'$$actors',
		accountEntitySelector
	)
}

export const writeLocalBlockheadSession = (
	context: LocalMutationContext,
	parentEntitySelector: EntitySelector<typeof schema, EntityType._Global>,
	sessionName: string
) => {
	const entitySelector = {
		id: `session-${Date.now()}`,
	}
	writeLocalBlockheadSessionName(context, entitySelector, sessionName)
	writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		parentEntitySelector,
		'$$blockheadSessions',
		entitySelector
	)
}

export const writeLocalBlockheadSessionName = (
	context: LocalMutationContext,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	sessionName: string
) => {
	const now = Date.now()
	writeLocalPresence(context, EntityType.BlockheadSession, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadSession, entitySelector, {
		...(sessionName !== '' && { name: sessionName }),
		status: BlockheadSessionStatus.Draft,
		createdAt: now,
		updatedAt: now,
	})
}

export const writeLocalBlockheadSessionAction = (
	context: LocalMutationContext,
	sessionEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	indexInSequence: number,
	actionType: ActionType
) => {
	const now = Date.now()
	const entitySelector = {
		sessionId: sessionEntitySelector.id,
		actionId: `${now}`,
	}
	writeLocalPresence(context, EntityType.BlockheadSessionAction, entitySelector)
	writeLocalEntityReferenceField(
		context,
		EntityType.BlockheadSessionAction,
		entitySelector,
		'$session',
		sessionEntitySelector
	)
	writeLocalPrimitiveFields(context, EntityType.BlockheadSessionAction, entitySelector, {
		indexInSequence,
		action: {
			type: actionType,
			params: actionTypeDefinitionByActionType[actionType].params.assert({}),
		},
		createdAt: now,
		updatedAt: now,
	})
	writeLocalEntityReferenceField(
		context,
		EntityType.BlockheadSession,
		sessionEntitySelector,
		'$$actions',
		entitySelector
	)
}

export const deleteLocalBlockheadSessionAction = (
	context: LocalMutationContext,
	sessionEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSessionAction>
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
	sessionSelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	indexInSequence: number,
	createdAt: number,
	actionType: ActionType
) => {
	writeLocalPresence(context, EntityType.BlockheadSessionAction, entitySelector)
	writeLocalEntityReferenceField(
		context,
		EntityType.BlockheadSessionAction,
		entitySelector,
		'$session',
		sessionSelector
	)
	writeLocalPrimitiveFields(context, EntityType.BlockheadSessionAction, entitySelector, {
		indexInSequence,
		action: {
			type: actionType,
			params: actionTypeDefinitionByActionType[actionType].params.assert({}),
		},
		createdAt,
		updatedAt: Date.now(),
	})
}

export const writeLocalBlockheadWallet = (
	context: LocalMutationContext,
	candidate: WalletCandidate
) => {
	const entitySelector = {
		id: candidate.id,
	}
	writeLocalPresence(context, EntityType.BlockheadWallet, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadWallet, entitySelector, {
		name: candidate.name,
		icon: candidate.icon,
		protocol: candidate.protocol,
		discoveryKind: candidate.discoveryKind,
		transportKind: candidate.transportKind,
		...(candidate.rdns != null && { rdns: candidate.rdns }),
		capabilities: candidate.capabilities,
	})
	writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$blockheadWallets' },
		'$$blockheadWallets',
		entitySelector
	)
}

export const writeLocalBlockheadWalletAccount = (
	context: LocalMutationContext,
	account: WalletConnection['accounts'][number]
) => {
	const entitySelector = {
		caip10: {
			namespace: account.namespace,
			reference: account.reference,
			accountAddress: account.accountAddress,
		},
	}
	writeLocalPresence(context, EntityType.BlockheadWalletAccount, entitySelector)
	writeLocalEntityReferenceField(
		context,
		EntityType.BlockheadWalletAccount,
		entitySelector,
		'$network',
		{
			caip2: {
				namespace: account.namespace,
				reference: account.reference,
			},
		}
	)
	writeLocalPrimitiveFields(context, EntityType.BlockheadWalletAccount, entitySelector, {
		address: account.accountAddress,
		capabilities: account.capabilities,
	})
	writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$blockheadWalletAccounts' },
		'$$blockheadWalletAccounts',
		entitySelector
	)
}

export const writeLocalBlockheadWalletConnection = (
	context: LocalMutationContext,
	connection: WalletConnection
) => {
	const activeAccount = connection.accounts.at(0)
	const entitySelector = {
		$wallet: {
			id: connection.walletId,
		},
	}
	connection.accounts.forEach((account) => writeLocalBlockheadWalletAccount(context, account))

	writeLocalPresence(context, EntityType.BlockheadWalletConnection, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadWalletConnection, entitySelector, {
		status: connection.status,
		protocol: connection.protocol,
		transportKind: connection.transportKind,
		scopes: connection.scopes,
	})
	connection.accounts.forEach((account, accountIndex) => {
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadWalletConnection,
			entitySelector,
			'$$connectedAccounts',
			{
				caip10: {
					namespace: account.namespace,
					reference: account.reference,
					accountAddress: account.accountAddress,
				},
			},
			accountIndex
		)
	})
	if (activeAccount != null)
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadWalletConnection,
			entitySelector,
			'$activeAccount',
			{
				caip10: {
					namespace: activeAccount.namespace,
					reference: activeAccount.reference,
					accountAddress: activeAccount.accountAddress,
				},
			}
		)
	writeLocalPrimitiveFields(context, EntityType.BlockheadWalletConnection, entitySelector, {
		selected: connection.selected,
		connectedAt: connection.connectedAt,
		error: connection.error,
	})
	writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$blockheadWalletConnections' },
		'$$blockheadWalletConnections',
		entitySelector
	)
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
	walletId: string
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
