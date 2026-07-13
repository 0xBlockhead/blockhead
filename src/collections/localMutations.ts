import {
	type ActionType,
	actionTypeDefinitionByActionType,
} from '$/constants/actions.ts'
import type { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import type { EntityCollectionsContext } from '$/client/$client.svelte.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSession.ts'
import type { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import {
	BlockheadSocialPostSessionStatus,
	SocialProtocol,
} from '$/schema/BlockheadSocialPostSession.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { Entity, EntityBaseFieldName, EntitySelector } from '$/schema/$schema.ts'
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
type LocalWalletCandidate = {
	id: string
	name: string
	icon: string
	protocol: WalletProtocol
	discoveryKind: WalletDiscoveryKind
	transportKind: WalletTransportKind
	rdns?: string
	capabilities: WalletCapability[]
}
type LocalWalletAccount = {
	namespace: string
	reference: string
	accountAddress: string
	capabilities: WalletCapability[]
}
type LocalBlockheadWorkspace = {
	id: string
	name?: string
	activePanelTreeId?: string
	createdAt?: number
	updatedAt?: number
}
type LocalBlockheadPanelTree = {
	id: string
	workspaceId?: string
}
type LocalBlockheadPanel = {
	treeId: string
	panelId: string
	parentPanelId?: string
	indexInParent: number
	kind: string
	entityType?: string
	selector?: object
}
type LocalWalletConnection = {
	connectionKey?: string
	walletId: string
	status: BlockheadConnectionStatus
	protocol: WalletProtocol
	transportKind: WalletTransportKind
	scopes: {
		namespace: string
		reference: string
		methods: string[]
		events: string[]
	}[]
	accounts: LocalWalletAccount[]
	selected: boolean
	connectedAt: number
	disconnectedAt?: number
	sessionId?: string
	sessionTopic?: string
	error?: string
}
type LocalBlockheadSocialPostSession = {
	id: string
	name?: string
	status?: BlockheadSocialPostSessionStatus
	protocol: SocialProtocol
	authorKey?: string
	walletConnectionKey?: string
	agentConversationId?: string
	text?: string
	mediaUrls?: string[]
	publishedEntityType?: string
	publishedSelector?: object
	createdAt?: number
	updatedAt?: number
	lockedAt?: number
}
type LocalBlockheadLocalMediaIngest = {
	ingestId: string
	fileName?: string
	mimeType?: string
	size?: number
	sha256?: `0x${string}`
	createdAt?: number
	mediaUrl?: string
}
type LocalBlockheadLocalMediaIngestTimestamp = {
	ingestId: string
	timestampMs: number
	source: string
	status: string
	uri?: string
	error?: string
}
type LocalBlockheadWalletRequestCall = {
	walletRequestId: string
	callIndex: number
	caip2?: {
		namespace: string
		reference: string
	}
	toAddress?: string
	value?: bigint
	inputDataHash?: string
}
type LocalBlockheadWalletRequest_Timestamp = {
	walletRequestId: string
	timestampMs: number
	source: string
	status: string
	walletStatusCode?: number
	walletCallBundleStatus?: string
	atomic?: boolean
	receiptCount?: number
	transactionHash?: string
	transactionId?: string
	signatureHash?: string
	statusPayloadHash?: string
	error?: string
}
type LocalBlockheadWalletRequest = {
	id: string
	sessionId?: string
	actionId?: string
	intentOrderId?: string
	walletConnectionKey?: string
	walletProtocol?: string
	caip10?: {
		namespace: string
		reference: string
		accountAddress: string
	}
	requestKind: string
	requestMethod: string
	chainId?: number
	fromAddress?: string
	toAddress?: string
	value?: bigint
	callCount?: number
	atomicRequired?: boolean
	requestPayloadHash?: string
	walletCallBundleId?: string
	requestedAt: number
	submittedAt?: number
	calls?: Omit<LocalBlockheadWalletRequestCall, 'walletRequestId'>[]
	timestamps?: Omit<LocalBlockheadWalletRequest_Timestamp, 'walletRequestId'>[]
}

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

const writeLocalPrimitiveFields = <
	const _EntityType extends EntityType,
>(
	context: LocalMutationContext,
	entityType: _EntityType,
	entitySelector: object,
	fields: Partial<Record<EntityBaseFieldName<typeof schema, _EntityType>, LocalPrimitiveFieldValue | undefined>>
) => {
	Object.entries(fields).forEach(([fieldName, value]) => {
		if (value !== undefined)
			context.entityFieldCollections[entityType][entityFieldAddressKey(entityType, [], fieldName)].utils.writeUpsert({
				facetPath: [],
				facetPathKey: stringify([]),
				fieldName,
				[EntityMetaKey.ParentSelector]: entitySelector,
				[EntityMetaKey.ParentSelectorKey]: stringify(entitySelector),
				[EntityMetaKey.Source]: Source.Local_Internal,
				[EntityMetaKey.Value]: value,
				valueKey: `Value:${stringify(value)}`,
			})
	})
}

const writeLocalEntityReferenceField = <
	const _EntityType extends EntityType,
	const _FieldName extends EntityBaseFieldName<typeof schema, _EntityType>,
>(
	context: LocalMutationContext,
	entityType: _EntityType,
	entitySelector: object,
	fieldName: _FieldName,
	referencedEntitySelector: object,
	valueIndex?: number
) => {
	context.entityFieldCollections[entityType][entityFieldAddressKey(entityType, [], fieldName)].utils.writeUpsert({
		facetPath: [],
		facetPathKey: stringify([]),
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
		actionType,
		actionParams: actionTypeDefinitionByActionType[actionType].params.assert({}),
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
	context.entityFieldCollections[EntityType.BlockheadSession][
		entityFieldAddressKey(EntityType.BlockheadSession, [], '$$actions')
	].delete(stringify([
		Source.Local_Internal,
		stringify(sessionEntitySelector),
		stringify([]),
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
		actionType,
		actionParams: actionTypeDefinitionByActionType[actionType].params.assert({}),
		createdAt,
		updatedAt: Date.now(),
	})
}

export const writeLocalBlockheadWorkspace = (
	context: LocalMutationContext,
	workspace: LocalBlockheadWorkspace
) => {
	const now = Date.now()
	const entitySelector = {
		id: workspace.id,
	}
	writeLocalPresence(context, EntityType.BlockheadWorkspace, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadWorkspace, entitySelector, {
		name: workspace.name,
		createdAt: workspace.createdAt ?? now,
		updatedAt: workspace.updatedAt ?? now,
	})
	if (workspace.activePanelTreeId != null)
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadWorkspace,
			entitySelector,
			'$activePanelTree',
			{
				id: workspace.activePanelTreeId,
			}
		)
	writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$blockheadWorkspaces' },
		'$$blockheadWorkspaces',
		entitySelector
	)
}

export const writeLocalBlockheadPanelTree = (
	context: LocalMutationContext,
	panelTree: LocalBlockheadPanelTree
) => {
	const entitySelector = {
		id: panelTree.id,
	}
	writeLocalPresence(context, EntityType.BlockheadPanelTree, entitySelector)
	if (panelTree.workspaceId != null)
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadPanelTree,
			entitySelector,
			'$workspace',
			{
				id: panelTree.workspaceId,
			}
		)
	writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$blockheadPanelTrees' },
		'$$blockheadPanelTrees',
		entitySelector
	)
}

export const writeLocalBlockheadPanel = (
	context: LocalMutationContext,
	panel: LocalBlockheadPanel
) => {
	const entitySelector = {
		treeId: panel.treeId,
		panelId: panel.panelId,
	}
	writeLocalPresence(context, EntityType.BlockheadPanel, entitySelector)
	writeLocalEntityReferenceField(
		context,
		EntityType.BlockheadPanel,
		entitySelector,
		'$panelTree',
		{
			id: panel.treeId,
		}
	)
	writeLocalPrimitiveFields(context, EntityType.BlockheadPanel, entitySelector, {
		parentPanelId: panel.parentPanelId,
		indexInParent: panel.indexInParent,
		kind: panel.kind,
		entityType: panel.entityType,
		selector: panel.selector,
	})
	writeLocalEntityReferenceField(
		context,
		EntityType.BlockheadPanelTree,
		{
			id: panel.treeId,
		},
		'$$panels',
		entitySelector,
		panel.indexInParent
	)
}

export const writeLocalBlockheadWallet = (
	context: LocalMutationContext,
	candidate: LocalWalletCandidate
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
	account: LocalWalletConnection['accounts'][number]
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
	connection: LocalWalletConnection
) => {
	const activeAccount = connection.accounts.at(0)
	const connectionKey = connection.connectionKey ?? connection.sessionTopic ?? connection.sessionId ?? connection.walletId
	const entitySelector = {
		connectionKey,
	}
	connection.accounts.forEach((account) => writeLocalBlockheadWalletAccount(context, account))

	writeLocalPresence(context, EntityType.BlockheadWalletConnection, entitySelector)
	writeLocalEntityReferenceField(
		context,
		EntityType.BlockheadWalletConnection,
		entitySelector,
		'$wallet',
		{
			id: connection.walletId,
		}
	)
	writeLocalPrimitiveFields(context, EntityType.BlockheadWalletConnection, entitySelector, {
		connectionKey,
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
		disconnectedAt: connection.disconnectedAt,
		sessionId: connection.sessionId,
		sessionTopic: connection.sessionTopic,
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
	connectionKey: string
) => {
	context.entityCollections[EntityType.BlockheadWalletConnection].delete(stringify([
		Source.Local_Internal,
		stringify({
			connectionKey,
		}),
	]))
	context.entityFieldCountCollections[EntityType.BlockheadWalletConnection].$$connectedAccounts?.delete(stringify([
		Source.Local_Internal,
		stringify({
			connectionKey,
		}),
		stringify({}),
	]))
}

export const writeLocalBlockheadSocialPostSession = (
	context: LocalMutationContext,
	session: LocalBlockheadSocialPostSession
) => {
	const entitySelector = {
		id: session.id,
	}
	const now = Date.now()
	writeLocalPresence(context, EntityType.BlockheadSocialPostSession, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadSocialPostSession, entitySelector, {
		name: session.name,
		status: session.status ?? BlockheadSocialPostSessionStatus.Draft,
		protocol: session.protocol,
		authorKey: session.authorKey,
		text: session.text,
		publishedEntityType: session.publishedEntityType,
		publishedSelector: session.publishedSelector,
		createdAt: session.createdAt ?? now,
		updatedAt: session.updatedAt ?? now,
		lockedAt: session.lockedAt,
	})
	if (session.walletConnectionKey != null)
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadSocialPostSession,
			entitySelector,
			'$walletConnection',
			{
				connectionKey: session.walletConnectionKey,
			}
		)
	if (session.agentConversationId != null)
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadSocialPostSession,
			entitySelector,
			'$agentConversation',
			{
				id: session.agentConversationId,
			}
		)
	session.mediaUrls?.forEach((url, valueIndex) => (
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadSocialPostSession,
			entitySelector,
			'$$media',
			{
				url,
			},
			valueIndex
		)
	))
}

export const writeLocalBlockheadLocalMediaIngest = (
	context: LocalMutationContext,
	ingest: LocalBlockheadLocalMediaIngest
) => {
	const entitySelector = {
		ingestId: ingest.ingestId,
	}
	writeLocalPresence(context, EntityType.BlockheadLocalMediaIngest, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadLocalMediaIngest, entitySelector, {
		fileName: ingest.fileName,
		mimeType: ingest.mimeType,
		size: ingest.size,
		sha256: ingest.sha256,
		createdAt: ingest.createdAt ?? Date.now(),
	})
	if (ingest.mediaUrl != null)
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadLocalMediaIngest,
			entitySelector,
			'$media',
			{
				url: ingest.mediaUrl,
			}
		)
	writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$blockheadLocalMediaIngests' },
		'$$blockheadLocalMediaIngests',
		entitySelector
	)
}

export const writeLocalBlockheadLocalMediaIngestTimestamp = (
	context: LocalMutationContext,
	observation: LocalBlockheadLocalMediaIngestTimestamp
) => {
	const ingestSelector = {
		ingestId: observation.ingestId,
	}
	const entitySelector = {
		$ingest: ingestSelector,
		timestampMs: observation.timestampMs,
		source: observation.source,
	}
	writeLocalPresence(context, EntityType.BlockheadLocalMediaIngest_Timestamp, entitySelector)
	writeLocalEntityReferenceField(
		context,
		EntityType.BlockheadLocalMediaIngest_Timestamp,
		entitySelector,
		'$ingest',
		ingestSelector
	)
	writeLocalPrimitiveFields(context, EntityType.BlockheadLocalMediaIngest_Timestamp, entitySelector, {
		timestampMs: observation.timestampMs,
		source: observation.source,
		status: observation.status,
		uri: observation.uri,
		error: observation.error,
	})
	writeLocalEntityReferenceField(
		context,
		EntityType.BlockheadLocalMediaIngest,
		ingestSelector,
		'$$timestamps',
		entitySelector
	)
}

export const writeLocalBlockheadWalletRequestCall = (
	context: LocalMutationContext,
	call: LocalBlockheadWalletRequestCall
) => {
	const walletRequestSelector = {
		id: call.walletRequestId,
	}
	const entitySelector = {
		$walletRequest: walletRequestSelector,
		callIndex: call.callIndex,
	}
	writeLocalPresence(context, EntityType.BlockheadWalletRequestCall, entitySelector)
	writeLocalEntityReferenceField(
		context,
		EntityType.BlockheadWalletRequestCall,
		entitySelector,
		'$walletRequest',
		walletRequestSelector
	)
	writeLocalPrimitiveFields(context, EntityType.BlockheadWalletRequestCall, entitySelector, {
		callIndex: call.callIndex,
		caip2: call.caip2,
		toAddress: call.toAddress,
		value: call.value,
		inputDataHash: call.inputDataHash,
	})
	writeLocalEntityReferenceField(
		context,
		EntityType.BlockheadWalletRequest,
		walletRequestSelector,
		'$$calls',
		entitySelector,
		call.callIndex
	)
}

export const writeLocalBlockheadWalletRequest_Timestamp = (
	context: LocalMutationContext,
	observation: LocalBlockheadWalletRequest_Timestamp
) => {
	const walletRequestSelector = {
		id: observation.walletRequestId,
	}
	const entitySelector = {
		$walletRequest: walletRequestSelector,
		timestampMs: observation.timestampMs,
		source: observation.source,
	}
	writeLocalPresence(context, EntityType.BlockheadWalletRequest_Timestamp, entitySelector)
	writeLocalEntityReferenceField(
		context,
		EntityType.BlockheadWalletRequest_Timestamp,
		entitySelector,
		'$walletRequest',
		walletRequestSelector
	)
	writeLocalPrimitiveFields(context, EntityType.BlockheadWalletRequest_Timestamp, entitySelector, {
		timestampMs: observation.timestampMs,
		source: observation.source,
		status: observation.status,
		walletStatusCode: observation.walletStatusCode,
		walletCallBundleStatus: observation.walletCallBundleStatus,
		atomic: observation.atomic,
		receiptCount: observation.receiptCount,
		transactionHash: observation.transactionHash,
		transactionId: observation.transactionId,
		signatureHash: observation.signatureHash,
		statusPayloadHash: observation.statusPayloadHash,
		error: observation.error,
	})
	writeLocalEntityReferenceField(
		context,
		EntityType.BlockheadWalletRequest,
		walletRequestSelector,
		'$$timestamps',
		entitySelector
	)
}

export const writeLocalBlockheadWalletRequest = (
	context: LocalMutationContext,
	request: LocalBlockheadWalletRequest
) => {
	const entitySelector = {
		id: request.id,
	}
	writeLocalPresence(context, EntityType.BlockheadWalletRequest, entitySelector)
	if (request.sessionId != null && request.actionId != null) {
		const sessionActionSelector = {
			sessionId: request.sessionId,
			actionId: request.actionId,
		}
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadWalletRequest,
			entitySelector,
			'$sessionAction',
			sessionActionSelector
		)
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadSessionAction,
			sessionActionSelector,
			'$$walletRequests',
			entitySelector
		)
	}
	if (request.intentOrderId != null)
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadWalletRequest,
			entitySelector,
			'$intentOrder',
			{
				id: request.intentOrderId,
			}
		)
	if (request.walletConnectionKey != null)
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadWalletRequest,
			entitySelector,
			'$walletConnection',
			{
				connectionKey: request.walletConnectionKey,
			}
		)
	writeLocalPrimitiveFields(context, EntityType.BlockheadWalletRequest, entitySelector, {
		id: request.id,
		walletProtocol: request.walletProtocol,
		caip10: request.caip10,
		requestKind: request.requestKind,
		requestMethod: request.requestMethod,
		chainId: request.chainId,
		fromAddress: request.fromAddress,
		toAddress: request.toAddress,
		value: request.value,
		callCount: request.callCount ?? request.calls?.length,
		atomicRequired: request.atomicRequired,
		requestPayloadHash: request.requestPayloadHash,
		walletCallBundleId: request.walletCallBundleId,
		requestedAt: request.requestedAt,
		submittedAt: request.submittedAt,
	})
	request.calls?.forEach((call) => (
		writeLocalBlockheadWalletRequestCall(context, {
			...call,
			walletRequestId: request.id,
		})
	))
	request.timestamps?.forEach((observation) => (
		writeLocalBlockheadWalletRequest_Timestamp(context, {
			...observation,
			walletRequestId: request.id,
		})
	))
	if (request.calls != null)
		context.entityFieldCountCollections[EntityType.BlockheadWalletRequest].$$calls?.utils.writeUpsert({
			[EntityMetaKey.ParentSelector]: entitySelector,
			[EntityMetaKey.ParentSelectorKey]: stringify(entitySelector),
			[EntityMetaKey.Source]: Source.Local_Internal,
			[EntityMetaKey.Value]: request.calls.length,
			fieldName: '$$calls',
			filterKey: stringify({}),
		})
	writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$blockheadWalletRequests' },
		'$$blockheadWalletRequests',
		entitySelector
	)
}
