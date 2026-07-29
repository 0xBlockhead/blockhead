import {
	type ActionType,
	actionTypeDefinitionByActionType,
} from '$/constants/actions.ts'
import type { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import {
	localMutationAuthorityKey,
	type MutationCollection,
} from '$/client/$client.svelte.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSessionStatus.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { BlockheadFarcasterConnectionAuthMethod } from '$/schema/BlockheadFarcasterConnectionAuthMethod.ts'
import { SocialProtocol } from '$/schema/SocialProtocol.ts'
import { BlockheadSocialPostSessionStatus } from '$/schema/BlockheadSocialPostSessionStatus.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	entityFieldDefinitions,
	entityFieldFacetPath,
	entitySelectorKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { Entity, EntitySelector } from '$/schema/$schema.ts'
import { entityDefinitionByType, schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { stringify } from 'devalue'

type LocalEntityRow = {
	[EntityMetaKey.Selector]: object
	[EntityMetaKey.SelectorKey]: string
	[EntityMetaKey.Source]: string
}
type LocalEntityFieldRow = {
	facetPath: readonly string[]
	facetPathKey: string
	fieldName: string
	valueKey: string
	valueIndex?: number
	[EntityMetaKey.ParentSelector]: object
	[EntityMetaKey.ParentSelectorKey]: string
	[EntityMetaKey.Source]: string
	[EntityMetaKey.Value]: object | string | number | boolean | bigint
}
type LocalEntityFieldCountRow = {
	facetPath: readonly string[]
	facetPathKey: string
	fieldName: string
	filterKey: string
	[EntityMetaKey.ParentSelector]: object
	[EntityMetaKey.ParentSelectorKey]: string
	[EntityMetaKey.Source]: string
	[EntityMetaKey.Value]: number
}

export type LocalMutationContext = {
	entityCollections: Record<string, MutationCollection<LocalEntityRow>>
	entityFieldCollections: Record<string, Record<string, MutationCollection<LocalEntityFieldRow>>>
	entityFieldCountCollections: Record<string, Record<string, MutationCollection<LocalEntityFieldCountRow> | undefined>>
}

export type LocalMutationAuthority = {
	authorityKey: string
	source: Source.Local_Internal
	entityType: EntityType
	selectorKey: string
	fieldName?: string
	fieldAddressKey?: string
	facetPathKey?: string
	filterKey?: string
	valueKey?: string
	valueIndex?: number
	resolution: 'present' | 'resolved' | 'deleted'
}

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
	activeAccount?: LocalWalletAccount
	selected: boolean
	connectedAt?: number
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
type LocalBlockheadFarcasterAccountConnection = {
	connectionId: string
	fid: number
	signerAddress: string
	authMethod: BlockheadFarcasterConnectionAuthMethod
	verifiedAt: number
	expiresAt: number
	associationFingerprint: string
	selected: boolean
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
	const selectorKey = entitySelectorKey(schema, entityDefinitionByType[entityType], entitySelector)
	const authority = {
		authorityKey: localMutationAuthorityKey({
			source: Source.Local_Internal,
			entityType,
			selectorKey,
		}),
		source: Source.Local_Internal,
		entityType,
		selectorKey,
		resolution: 'present',
	} as const
	context.entityCollections[entityType].startSyncImmediate()
	context.entityCollections[entityType].utils.writeUpsertWithAuthority(
		{
			[EntityMetaKey.Selector]: entitySelector,
			[EntityMetaKey.SelectorKey]: selectorKey,
			[EntityMetaKey.Source]: Source.Local_Internal,
		},
		authority.selectorKey,
		authority.authorityKey,
		authority.resolution
	)
}

const deleteLocalPresence = (
	context: LocalMutationContext,
	entityType: EntityType,
	entitySelector: object
) => {
	const selectorKey = entitySelectorKey(schema, entityDefinitionByType[entityType], entitySelector)
	context.entityCollections[entityType].startSyncImmediate()
	context.entityCollections[entityType].utils.replaceRowsWithAuthority(
		(row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
			&& row[EntityMetaKey.SelectorKey] === selectorKey
		),
		[],
		selectorKey,
		localMutationAuthorityKey({
			source: Source.Local_Internal,
			entityType,
			selectorKey,
		}),
		'deleted'
	)
}

const localMutationAuthority = (
	entityType: EntityType,
	entitySelector: object,
	details: Omit<LocalMutationAuthority, 'authorityKey' | 'source' | 'entityType' | 'selectorKey'>
) => {
	const selectorKey = entitySelectorKey(schema, entityDefinitionByType[entityType], entitySelector)
	return {
		...details,
		fieldAddressKey: (
			details.fieldName === undefined ?
				undefined
			:
				entityFieldAddressKey(String(entityType), [], details.fieldName)
		),
		authorityKey: localMutationAuthorityKey({
			source: Source.Local_Internal,
			entityType,
			selectorKey,
			...details,
			fieldAddressKey: (
				details.fieldName === undefined ?
					undefined
				:
					entityFieldAddressKey(String(entityType), [], details.fieldName)
			),
		}),
		source: Source.Local_Internal,
		entityType,
		selectorKey,
	} as const
}

const writeLocalPrimitiveFields = (
	context: LocalMutationContext,
	entityType: EntityType,
	entitySelector: object,
	fields: Partial<Record<string, LocalPrimitiveFieldValue | undefined>>
) => {
	Object.entries(fields).forEach(([fieldName, value]) => {
		const parentSelectorKey = entitySelectorKey(schema, entityDefinitionByType[entityType], entitySelector)
		const collection = context.entityFieldCollections[entityType][entityFieldAddressKey(entityType, [], fieldName)]
		collection.startSyncImmediate()
		const authority = localMutationAuthority(entityType, entitySelector, {
			fieldName,
			facetPathKey: stringify([]),
			resolution: 'resolved',
		})
		collection.utils.replaceRowsWithAuthority(
			(row) => (
				row[EntityMetaKey.Source] === Source.Local_Internal
				&& row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
				&& row.facetPathKey === stringify([])
			),
			value === undefined ? [] : [{
				facetPath: [],
				facetPathKey: stringify([]),
				fieldName,
				[EntityMetaKey.ParentSelector]: entitySelector,
				[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
				[EntityMetaKey.Source]: Source.Local_Internal,
				[EntityMetaKey.Value]: value,
				valueKey: `Value:${stringify(value)}`,
			}],
			authority.selectorKey,
			authority.authorityKey,
			authority.resolution
		)
	})
}

const deleteLocalEntityFields = (
	context: LocalMutationContext,
	entityType: EntityType,
	entitySelector: object
) => {
	const parentSelectorKey = entitySelectorKey(schema, entityDefinitionByType[entityType], entitySelector)
	entityFieldDefinitions(entityDefinitionByType[entityType]).forEach((definition) => {
		const facetPath = entityFieldFacetPath(definition)
		const fieldAddressKey = entityFieldAddressKey(String(entityType), facetPath, String(definition.name))
		const collection = context.entityFieldCollections[entityType][fieldAddressKey]
		collection.startSyncImmediate()
		collection.utils.replaceRowsWithAuthority(
			(row) => (
				row[EntityMetaKey.Source] === Source.Local_Internal
				&& row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
			),
			[],
			parentSelectorKey,
			localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType,
				selectorKey: parentSelectorKey,
				fieldName: definition.name,
				fieldAddressKey,
				facetPathKey: stringify(facetPath),
			}),
			'deleted'
		)
	})
	entityFieldDefinitions(entityDefinitionByType[entityType]).forEach((definition) => {
		const facetPath = entityFieldFacetPath(definition)
		const fieldAddressKey = entityFieldAddressKey(String(entityType), facetPath, String(definition.name))
		const collection = context.entityFieldCountCollections[entityType][fieldAddressKey]
		collection?.startSyncImmediate()
		collection?.utils.replaceRowsWithAuthority(
			(row) => (
				row[EntityMetaKey.Source] === Source.Local_Internal
				&& row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
			),
			[],
			parentSelectorKey,
			localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType,
				selectorKey: parentSelectorKey,
				fieldName: definition.name,
				fieldAddressKey,
				facetPathKey: stringify(facetPath),
				filterKey: stringify({}),
			}),
			'deleted'
		)
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
	const collection = context.entityFieldCollections[entityType][entityFieldAddressKey(entityType, [], fieldName)]
	collection.startSyncImmediate()
	const fieldDefinition = entityFieldDefinitions(entityDefinitionByType[entityType]).find((definition) => definition.name === fieldName)
	if (fieldDefinition?.type !== EntityFieldType.EntityReference && fieldDefinition?.type !== EntityFieldType.EntitiesReference)
		throw new Error(`Local mutation field is not an entity reference: ${entityType}.${fieldName}`)
	const parentSelectorKey = entitySelectorKey(
		schema,
		entityDefinitionByType[entityType],
		entitySelector
	)
	const referencedEntitySelectorKey = entitySelectorKey(
		schema,
		entityDefinitionByType[fieldDefinition.entityType],
		referencedEntitySelector
	)
	const valueKey = `Entity:${referencedEntitySelectorKey}`
	const relationshipValueIndex = (
		fieldDefinition.type === EntityFieldType.EntitiesReference ?
			valueIndex
				?? collection.toArray.find((row) => (
					row[EntityMetaKey.Source] === Source.Local_Internal
					&& row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
					&& row.facetPathKey === stringify([])
					&& row.valueKey === valueKey
				))?.valueIndex
				?? collection.toArray.reduce((highestValueIndex, row) => (
					row[EntityMetaKey.Source] === Source.Local_Internal
					&& row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
					&& row.facetPathKey === stringify([])
					&& row.valueIndex !== undefined ?
						Math.max(highestValueIndex, row.valueIndex)
					:
						highestValueIndex
				), -1) + 1
		:
			undefined
	)
	const authority = localMutationAuthority(entityType, entitySelector, {
		fieldName,
		facetPathKey: stringify([]),
		...(fieldName.startsWith('$$') && {
			valueKey,
		}),
		resolution: fieldName.startsWith('$$') ? 'present' : 'resolved',
	})
	collection.utils.writeUpsertWithAuthority({
		facetPath: [],
		facetPathKey: stringify([]),
		fieldName,
		...(relationshipValueIndex !== undefined && {
			valueIndex: relationshipValueIndex,
		}),
		[EntityMetaKey.ParentSelector]: entitySelector,
		[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Selector]: referencedEntitySelector,
			[EntityMetaKey.SelectorKey]: referencedEntitySelectorKey,
		},
		valueKey,
	},
		authority.selectorKey,
		authority.authorityKey,
		authority.resolution
	)
}

const writeLocalEntityReferenceFieldCount = (
	context: LocalMutationContext,
	entityType: EntityType,
	entitySelector: object,
	fieldName: string
) => {
	const parentSelectorKey = entitySelectorKey(schema, entityDefinitionByType[entityType], entitySelector)
	const fieldCollection = context.entityFieldCollections[entityType][
		entityFieldAddressKey(entityType, [], fieldName)
	]
	const countCollection = context.entityFieldCountCollections[entityType][
		entityFieldAddressKey(entityType, [], fieldName)
	]
	fieldCollection.startSyncImmediate()
	if (countCollection == null)
		return

	countCollection.startSyncImmediate()
	const localFieldRows = fieldCollection.toArray.filter((row) => (
		row[EntityMetaKey.Source] === Source.Local_Internal
		&& row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
		&& row.facetPathKey === stringify([])
	))
	const authority = localMutationAuthority(entityType, entitySelector, {
		fieldName,
		facetPathKey: stringify([]),
		filterKey: stringify({}),
		resolution: 'resolved',
	})
	countCollection.utils.writeUpsertWithAuthority({
		[EntityMetaKey.ParentSelector]: entitySelector,
		[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: localFieldRows.length,
		facetPath: [],
		facetPathKey: stringify([]),
		fieldName,
		filterKey: stringify({}),
	},
		authority.selectorKey,
		authority.authorityKey,
		authority.resolution
	)
	const fieldAuthority = localMutationAuthority(entityType, entitySelector, {
		fieldName,
		facetPathKey: stringify([]),
		resolution: 'resolved',
	})
	fieldCollection.utils.replaceRowsWithAuthority(
		() => false,
		[],
		fieldAuthority.selectorKey,
		fieldAuthority.authorityKey,
		fieldAuthority.resolution
	)
}

const deleteLocalEntityReferenceField = (
	context: LocalMutationContext,
	entityType: EntityType,
	entitySelector: object,
	fieldName: string,
	referencedEntitySelector: object
) => {
	const fieldDefinition = entityFieldDefinitions(entityDefinitionByType[entityType]).find((definition) => definition.name === fieldName)
	if (fieldDefinition?.type !== EntityFieldType.EntityReference && fieldDefinition?.type !== EntityFieldType.EntitiesReference)
		throw new Error(`Local mutation field is not an entity reference: ${entityType}.${fieldName}`)
	const valueKey = `Entity:${entitySelectorKey(
		schema,
		entityDefinitionByType[fieldDefinition.entityType],
		referencedEntitySelector
	)}`
	const authority = localMutationAuthority(entityType, entitySelector, {
		fieldName,
		facetPathKey: stringify([]),
		valueKey,
		resolution: 'deleted',
	})
	context.entityFieldCollections[entityType][entityFieldAddressKey(entityType, [], fieldName)].startSyncImmediate()
	context.entityFieldCollections[entityType][entityFieldAddressKey(entityType, [], fieldName)].utils.replaceRowsWithAuthority(
		(row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
				&& row[EntityMetaKey.ParentSelectorKey] === entitySelectorKey(schema, entityDefinitionByType[entityType], entitySelector)
				&& row.valueKey === valueKey
		),
		[],
		authority.selectorKey,
		authority.authorityKey,
		authority.resolution
	)
}

const replaceLocalEntityReferenceFieldRows = (
	context: LocalMutationContext,
	entityType: EntityType,
	entitySelector: object,
	fieldName: string,
	referencedEntitySelectors: readonly object[]
) => {
	const fieldDefinition = entityFieldDefinitions(entityDefinitionByType[entityType]).find((definition) => definition.name === fieldName)
	if (fieldDefinition?.type !== EntityFieldType.EntityReference && fieldDefinition?.type !== EntityFieldType.EntitiesReference)
		throw new Error(`Local mutation field is not an entity reference: ${entityType}.${fieldName}`)
	if (fieldDefinition.type === EntityFieldType.EntityReference && referencedEntitySelectors.length > 1)
		throw new Error(`Local mutation singular reference received multiple values: ${entityType}.${fieldName}`)

	const parentSelectorKey = entitySelectorKey(schema, entityDefinitionByType[entityType], entitySelector)
	const authority = localMutationAuthority(entityType, entitySelector, {
		fieldName,
		facetPathKey: stringify([]),
		resolution: 'resolved',
	})
	context.entityFieldCollections[entityType][entityFieldAddressKey(entityType, [], fieldName)].startSyncImmediate()
	context.entityFieldCollections[entityType][entityFieldAddressKey(entityType, [], fieldName)].utils.replaceRowsWithAuthority(
		(row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
			&& row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
		),
		referencedEntitySelectors.map((referencedEntitySelector, valueIndex) => {
			const referencedEntitySelectorKey = entitySelectorKey(
				schema,
				entityDefinitionByType[fieldDefinition.entityType],
				referencedEntitySelector
			)
			return {
				facetPath: [],
				facetPathKey: stringify([]),
				fieldName,
				...(fieldDefinition.type === EntityFieldType.EntitiesReference && {
					valueIndex,
				}),
				[EntityMetaKey.ParentSelector]: entitySelector,
				[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
				[EntityMetaKey.Source]: Source.Local_Internal,
				[EntityMetaKey.Value]: {
					[EntityMetaKey.Selector]: referencedEntitySelector,
					[EntityMetaKey.SelectorKey]: referencedEntitySelectorKey,
				},
				valueKey: `Entity:${referencedEntitySelectorKey}`,
			}
		}),
		authority.selectorKey,
		authority.authorityKey,
		authority.resolution
	)
}

const deleteLocalEntityReferenceFieldRows = (
	context: LocalMutationContext,
	entityType: EntityType,
	entitySelector: object,
	fieldName: string
) => replaceLocalEntityReferenceFieldRows(
	context,
	entityType,
	entitySelector,
	fieldName,
	[]
)

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
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType._Global,
		{ scope: '$$actors' },
		'$$actors'
	)
}

export const writeLocalBlockheadSession = async (
	context: LocalMutationContext,
	parentEntitySelector: EntitySelector<typeof schema, EntityType._Global>,
	sessionName: string
) => {
	const now = Date.now()
	const entitySelector = {
		id: `session-${globalThis.crypto.randomUUID()}`,
	}
	writeLocalPresence(context, EntityType.BlockheadSession, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadSession, entitySelector, {
		name: sessionName === '' ? undefined : sessionName,
		status: BlockheadSessionStatus.Draft,
		createdAt: now,
		updatedAt: now,
		lockedAt: undefined,
		simulationCount: undefined,
	})
	deleteLocalEntityReferenceFieldRows(
		context,
		EntityType.BlockheadSession,
		entitySelector,
		'$latestSimulation'
	)
	for (const fieldName of [
		'$$actions',
		'$$intentInvocations',
		'$$simulations',
	] as const) {
		deleteLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadSession,
			entitySelector,
			fieldName
		)
		writeLocalEntityReferenceFieldCount(
			context,
			EntityType.BlockheadSession,
			entitySelector,
			fieldName
		)
	}
	await Promise.all([
		context.entityCollections[EntityType.BlockheadSession].utils.waitForPersistence(),
		...[
			'name',
			'status',
			'createdAt',
			'updatedAt',
			'lockedAt',
			'simulationCount',
			'$latestSimulation',
			'$$actions',
			'$$intentInvocations',
			'$$simulations',
		].map((fieldName) => (
			context.entityFieldCollections[EntityType.BlockheadSession][
				entityFieldAddressKey(EntityType.BlockheadSession, [], fieldName)
			].utils.waitForPersistence()
		)),
		...[
			'$$actions',
			'$$intentInvocations',
			'$$simulations',
		].flatMap((fieldName) => {
			const collection = context.entityFieldCountCollections[EntityType.BlockheadSession][
				entityFieldAddressKey(EntityType.BlockheadSession, [], fieldName)
			]
			return collection === undefined ? [] : [collection.utils.waitForPersistence()]
		}),
	])
	writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		parentEntitySelector,
		'$$blockheadSessions',
		entitySelector
	)
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType._Global,
		parentEntitySelector,
		'$$blockheadSessions'
	)
	await Promise.all([
		context.entityFieldCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadSessions')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadSessions')
		]?.utils.waitForPersistence(),
	])

	return entitySelector
}

export const writeLocalBlockheadSessionName = (
	context: LocalMutationContext,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	sessionName: string
) => {
	writeLocalPresence(context, EntityType.BlockheadSession, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadSession, entitySelector, {
		name: sessionName === '' ? undefined : sessionName,
		updatedAt: Date.now(),
	})
}

export const writeLocalBlockheadSessionAction = (
	context: LocalMutationContext,
	sessionEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	indexInSequence: number,
	actionType: ActionType,
	actionParams?: object
) => {
	const now = Date.now()
	const validatedActionParams = actionTypeDefinitionByActionType[actionType].params.assert(actionParams ?? {})
	const entitySelector = {
		sessionId: sessionEntitySelector.id,
		actionId: globalThis.crypto.randomUUID(),
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
		actionParams: validatedActionParams,
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
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType.BlockheadSession,
		sessionEntitySelector,
		'$$actions'
	)
	writeLocalPrimitiveFields(context, EntityType.BlockheadSession, sessionEntitySelector, {
		updatedAt: now,
	})
	return Promise.all([
		context.entityCollections[EntityType.BlockheadSessionAction].utils.waitForPersistence(),
		...[
			'$session',
			'indexInSequence',
			'actionType',
			'actionParams',
			'createdAt',
			'updatedAt',
		].map((fieldName) => context.entityFieldCollections[EntityType.BlockheadSessionAction][
			entityFieldAddressKey(EntityType.BlockheadSessionAction, [], fieldName)
		].utils.waitForPersistence()),
		context.entityFieldCollections[EntityType.BlockheadSession][
			entityFieldAddressKey(EntityType.BlockheadSession, [], '$$actions')
		].utils.waitForPersistence(),
		context.entityFieldCollections[EntityType.BlockheadSession][
			entityFieldAddressKey(EntityType.BlockheadSession, [], 'updatedAt')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType.BlockheadSession][
			entityFieldAddressKey(EntityType.BlockheadSession, [], '$$actions')
		]?.utils.waitForPersistence(),
	])
}

export const writeLocalBlockheadSessionLockedAt = (
	context: LocalMutationContext,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	lockedAt: number | undefined
) => {
	if (lockedAt === undefined)
		return

	writeLocalPresence(context, EntityType.BlockheadSession, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadSession, entitySelector, {
		lockedAt,
		updatedAt: Date.now(),
	})
}

export const deleteLocalBlockheadSessionLockedAt = (
	context: LocalMutationContext,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>
) => {
	writeLocalPrimitiveFields(context, EntityType.BlockheadSession, entitySelector, {
		lockedAt: undefined,
		updatedAt: Date.now(),
	})
}

export const deleteLocalBlockheadSession = (
	context: LocalMutationContext,
	parentEntitySelector: EntitySelector<typeof schema, EntityType._Global>,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>
) => {
	let deletedAction = false
	for (const actionRow of context.entityFieldCollections[EntityType.BlockheadSession][
		entityFieldAddressKey(EntityType.BlockheadSession, [], '$$actions')
	].toArray.filter((row) => (
		row[EntityMetaKey.Source] === Source.Local_Internal
		&& row[EntityMetaKey.ParentSelectorKey] === entitySelectorKey(schema, entityDefinitionByType[EntityType.BlockheadSession], entitySelector)
	))) {
		const actionSelector = Object(Object.getOwnPropertyDescriptor(
			Object(actionRow[EntityMetaKey.Value]),
			EntityMetaKey.Selector
		)?.value)
		deletedAction = true
		deleteLocalEntityFields(context, EntityType.BlockheadSessionAction, actionSelector)
		deleteLocalPresence(context, EntityType.BlockheadSessionAction, actionSelector)
	}
	deleteLocalEntityReferenceField(
		context,
		EntityType._Global,
		parentEntitySelector,
		'$$blockheadSessions',
		entitySelector
	)
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType._Global,
		parentEntitySelector,
		'$$blockheadSessions'
	)
	deleteLocalEntityFields(context, EntityType.BlockheadSession, entitySelector)
	deleteLocalPresence(context, EntityType.BlockheadSession, entitySelector)
	return Promise.all([
		context.entityCollections[EntityType.BlockheadSession].utils.waitForPersistence(),
		...(deletedAction ? [
			context.entityCollections[EntityType.BlockheadSessionAction].utils.waitForPersistence(),
		] : []),
		...Object.values(context.entityFieldCollections[EntityType.BlockheadSession])
			.map((collection) => collection.utils.waitForPersistence()),
		...(deletedAction ?
			Object.values(context.entityFieldCollections[EntityType.BlockheadSessionAction])
				.map((collection) => collection.utils.waitForPersistence())
		:
			[]),
		...Object.values(context.entityFieldCountCollections[EntityType.BlockheadSession])
			.flatMap((collection) => collection === undefined ? [] : [collection.utils.waitForPersistence()]),
		context.entityFieldCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadSessions')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadSessions')
		]?.utils.waitForPersistence(),
	])
}

export const deleteLocalBlockheadSessionAction = async (
	context: LocalMutationContext,
	sessionEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSessionAction>
) => {
	deleteLocalEntityReferenceField(
		context,
		EntityType.BlockheadSession,
		sessionEntitySelector,
		'$$actions',
		entitySelector
	)
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType.BlockheadSession,
		sessionEntitySelector,
		'$$actions'
	)
	await Promise.all([
		context.entityFieldCollections[EntityType.BlockheadSession][
			entityFieldAddressKey(EntityType.BlockheadSession, [], '$$actions')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType.BlockheadSession][
			entityFieldAddressKey(EntityType.BlockheadSession, [], '$$actions')
		]?.utils.waitForPersistence(),
	])
	deleteLocalEntityFields(context, EntityType.BlockheadSessionAction, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadSession, sessionEntitySelector, {
		updatedAt: Date.now(),
	})
	await Promise.all([
		...Object.values(context.entityFieldCollections[EntityType.BlockheadSessionAction])
			.map((collection) => collection.utils.waitForPersistence()),
		context.entityFieldCollections[EntityType.BlockheadSession][
			entityFieldAddressKey(EntityType.BlockheadSession, [], 'updatedAt')
		].utils.waitForPersistence(),
	])
	deleteLocalPresence(context, EntityType.BlockheadSessionAction, entitySelector)
	await context.entityCollections[EntityType.BlockheadSessionAction].utils.waitForPersistence()
}

export const updateLocalBlockheadSessionActionType = (
	context: LocalMutationContext,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSessionAction>,
	sessionSelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	indexInSequence: number,
	createdAt: number,
	actionType: ActionType,
	actionParams: object = {}
) => {
	const validatedActionParams = actionTypeDefinitionByActionType[actionType].params.assert(actionParams)
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
		actionParams: validatedActionParams,
		createdAt,
		updatedAt: Date.now(),
	})
	return Promise.all([
		context.entityCollections[EntityType.BlockheadSessionAction].utils.waitForPersistence(),
		...[
			'$session',
			'indexInSequence',
			'actionType',
			'actionParams',
			'createdAt',
			'updatedAt',
		].map((fieldName) => context.entityFieldCollections[EntityType.BlockheadSessionAction][
			entityFieldAddressKey(EntityType.BlockheadSessionAction, [], fieldName)
		].utils.waitForPersistence()),
	])
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
	deleteLocalEntityReferenceFieldRows(
		context,
		EntityType.BlockheadWorkspace,
		entitySelector,
		'$activePanelTree'
	)
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
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType._Global,
		{ scope: '$$blockheadWorkspaces' },
		'$$blockheadWorkspaces'
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
	deleteLocalEntityReferenceFieldRows(
		context,
		EntityType.BlockheadPanelTree,
		entitySelector,
		'$workspace'
	)
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
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType._Global,
		{ scope: '$$blockheadPanelTrees' },
		'$$blockheadPanelTrees'
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
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType.BlockheadPanelTree,
		{
			id: panel.treeId,
		},
		'$$panels'
	)
}

export const deleteLocalBlockheadPanel = (
	context: LocalMutationContext,
	treeId: string,
	panelId: string
) => {
	const panelTreeSelector = {
		id: treeId,
	}
	const panelSelector = {
		treeId,
		panelId,
	}
	deleteLocalEntityReferenceField(
		context,
		EntityType.BlockheadPanelTree,
		panelTreeSelector,
		'$$panels',
		panelSelector
	)
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType.BlockheadPanelTree,
		panelTreeSelector,
		'$$panels'
	)
	deleteLocalEntityFields(context, EntityType.BlockheadPanel, panelSelector)
	deleteLocalPresence(context, EntityType.BlockheadPanel, panelSelector)
}

export const writeLocalBlockheadWallet = async (
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
		rdns: candidate.rdns,
		websiteUrl: undefined,
		capabilities: candidate.capabilities,
		adapterId: undefined,
		sourceWalletKey: undefined,
		detectedAt: undefined,
	})
	await Promise.all([
		context.entityCollections[EntityType.BlockheadWallet].utils.waitForPersistence(),
		...[
			'name',
			'icon',
			'protocol',
			'discoveryKind',
			'transportKind',
			'rdns',
			'websiteUrl',
			'capabilities',
			'adapterId',
			'sourceWalletKey',
			'detectedAt',
		].map((fieldName) => (
			context.entityFieldCollections[EntityType.BlockheadWallet][
				entityFieldAddressKey(EntityType.BlockheadWallet, [], fieldName)
			].utils.waitForPersistence()
		)),
	])
	writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$blockheadWallets' },
		'$$blockheadWallets',
		entitySelector
	)
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType._Global,
		{ scope: '$$blockheadWallets' },
		'$$blockheadWallets'
	)
	await Promise.all([
		context.entityFieldCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadWallets')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadWallets')
		]?.utils.waitForPersistence(),
	])
}

export const writeLocalBlockheadAccount = async (
	context: LocalMutationContext,
	account: Pick<
		LocalWalletAccount,
		'namespace' | 'reference' | 'accountAddress'
	>
) => {
	const accountSelector = {
		caip10: {
			namespace: account.namespace,
			reference: account.reference,
			accountAddress: account.accountAddress,
		},
	}
	const entitySelector = {
		$account: accountSelector,
	}
	writeLocalPresence(context, EntityType.BlockheadAccount, entitySelector)
	writeLocalEntityReferenceField(
		context,
		EntityType.BlockheadAccount,
		entitySelector,
		'$account',
		accountSelector
	)
	await Promise.all([
		context.entityCollections[EntityType.BlockheadAccount].utils.waitForPersistence(),
		context.entityFieldCollections[EntityType.BlockheadAccount][
			entityFieldAddressKey(EntityType.BlockheadAccount, [], '$account')
		].utils.waitForPersistence(),
	])
	writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$blockheadAccounts' },
		'$$blockheadAccounts',
		entitySelector
	)
	await context.entityFieldCollections[EntityType._Global][
		entityFieldAddressKey(EntityType._Global, [], '$$blockheadAccounts')
	].utils.waitForPersistence()
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType._Global,
		{ scope: '$$blockheadAccounts' },
		'$$blockheadAccounts'
	)
	await Promise.all([
		context.entityFieldCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadAccounts')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadAccounts')
		]?.utils.waitForPersistence(),
	])
}

export const writeLocalBlockheadWalletConnection = async (
	context: LocalMutationContext,
	connection: LocalWalletConnection
) => {
	for (const account of connection.accounts)
		await writeLocalBlockheadAccount(context, account)
	const activeAccount = connection.activeAccount ?? connection.accounts.at(0)
	const connectionKey = connection.connectionKey ?? connection.sessionTopic ?? connection.sessionId ?? connection.walletId
	const entitySelector = {
		connectionKey,
	}

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
	replaceLocalEntityReferenceFieldRows(
		context,
		EntityType.BlockheadWalletConnection,
		entitySelector,
		'$$accounts',
		connection.accounts.map((account) => ({
			caip10: {
				namespace: account.namespace,
				reference: account.reference,
				accountAddress: account.accountAddress,
			},
		}))
	)
	replaceLocalEntityReferenceFieldRows(
		context,
		EntityType.BlockheadWalletConnection,
		entitySelector,
		'$activeAccount',
		activeAccount == null ? [] : [{
				caip10: {
					namespace: activeAccount.namespace,
					reference: activeAccount.reference,
					accountAddress: activeAccount.accountAddress,
				},
			}]
	)
	writeLocalPrimitiveFields(context, EntityType.BlockheadWalletConnection, entitySelector, {
		selected: connection.selected,
		connectedAt: connection.connectedAt,
		disconnectedAt: connection.disconnectedAt,
		sessionId: connection.sessionId,
		sessionTopic: connection.sessionTopic,
		error: connection.error,
	})
	await Promise.all([
		context.entityCollections[EntityType.BlockheadWalletConnection].utils.waitForPersistence(),
		...[
			'$wallet',
			'connectionKey',
			'status',
			'protocol',
			'transportKind',
			'scopes',
			'$$accounts',
			'$activeAccount',
			'selected',
			...(connection.connectedAt === undefined ? [] : ['connectedAt']),
			...(connection.disconnectedAt === undefined ? [] : ['disconnectedAt']),
			...(connection.sessionId === undefined ? [] : ['sessionId']),
			...(connection.sessionTopic === undefined ? [] : ['sessionTopic']),
			...(connection.error === undefined ? [] : ['error']),
		].map((fieldName) => (
			context.entityFieldCollections[EntityType.BlockheadWalletConnection][
				entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], fieldName)
			].utils.waitForPersistence()
		)),
	])
	writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$blockheadWalletConnections' },
		'$$blockheadWalletConnections',
		entitySelector
	)
	await context.entityFieldCollections[EntityType._Global][
		entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletConnections')
	].utils.waitForPersistence()
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType.BlockheadWalletConnection,
		entitySelector,
		'$$accounts'
	)
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType._Global,
		{ scope: '$$blockheadWalletConnections' },
		'$$blockheadWalletConnections'
	)
	await Promise.all([
		context.entityFieldCollections[EntityType.BlockheadWalletConnection][
			entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], '$$accounts')
		].utils.waitForPersistence(),
		context.entityFieldCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletConnections')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType.BlockheadWalletConnection][
			entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], '$$accounts')
		]?.utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletConnections')
		]?.utils.waitForPersistence(),
	])
}

export const deleteLocalBlockheadWalletConnection = async (
	context: LocalMutationContext,
	connectionKey: string
) => {
	const entitySelector = {
		connectionKey,
	}
	const parentEntitySelector = {
		scope: '$$blockheadWalletConnections',
	}
	replaceLocalEntityReferenceFieldRows(
		context,
		EntityType._Global,
		parentEntitySelector,
		'$$blockheadWalletConnections',
		context.entityFieldCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletConnections')
		].toArray.filter((row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
			&& row[EntityMetaKey.ParentSelectorKey] === entitySelectorKey(
				schema,
				entityDefinitionByType[EntityType._Global],
				parentEntitySelector
			)
			&& row.valueKey !== `Entity:${entitySelectorKey(
				schema,
				entityDefinitionByType[EntityType.BlockheadWalletConnection],
				entitySelector
			)}`
		)).map((row) => Object(Object.getOwnPropertyDescriptor(
			Object(row[EntityMetaKey.Value]),
			EntityMetaKey.Selector
		)?.value))
	)
	await context.entityFieldCollections[EntityType._Global][
		entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletConnections')
	].utils.waitForPersistence()
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType._Global,
		parentEntitySelector,
		'$$blockheadWalletConnections'
	)
	await Promise.all([
		context.entityFieldCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletConnections')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletConnections')
		]?.utils.waitForPersistence(),
	])
	deleteLocalEntityFields(
		context,
		EntityType.BlockheadWalletConnection,
		entitySelector
	)
	deleteLocalPresence(context, EntityType.BlockheadWalletConnection, entitySelector)
	await Promise.all([
		context.entityCollections[EntityType.BlockheadWalletConnection].utils.waitForPersistence(),
		...Object.values(context.entityFieldCollections[EntityType.BlockheadWalletConnection])
			.map((collection) => collection.utils.waitForPersistence()),
		...Object.values(context.entityFieldCountCollections[EntityType.BlockheadWalletConnection])
			.flatMap((collection) => (
				collection === undefined ? [] : [collection.utils.waitForPersistence()]
			)),
	])
}

export const writeLocalBlockheadFarcasterAccountConnection = (
	context: LocalMutationContext,
	connection: LocalBlockheadFarcasterAccountConnection
) => {
	const entitySelector = {
		connectionId: connection.connectionId,
	}
	writeLocalPresence(context, EntityType.BlockheadFarcasterAccountConnection, entitySelector)
	writeLocalEntityReferenceField(
		context,
		EntityType.BlockheadFarcasterAccountConnection,
		entitySelector,
		'$user',
		{
			fid: connection.fid,
		}
	)
	writeLocalPrimitiveFields(context, EntityType.BlockheadFarcasterAccountConnection, entitySelector, {
		connectionId: connection.connectionId,
		signerAddress: connection.signerAddress,
		authMethod: connection.authMethod,
		verifiedAt: connection.verifiedAt,
		expiresAt: connection.expiresAt,
		associationFingerprint: connection.associationFingerprint,
		selected: connection.selected,
	})
	writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$blockheadFarcasterAccountConnections' },
		'$$blockheadFarcasterAccountConnections',
		entitySelector
	)
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType._Global,
		{ scope: '$$blockheadFarcasterAccountConnections' },
		'$$blockheadFarcasterAccountConnections'
	)
}

export const deleteLocalBlockheadFarcasterAccountConnection = (
	context: LocalMutationContext,
	connectionId: string
) => {
	const entitySelector = {
		connectionId,
	}
	deleteLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$blockheadFarcasterAccountConnections' },
		'$$blockheadFarcasterAccountConnections',
		entitySelector
	)
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType._Global,
		{ scope: '$$blockheadFarcasterAccountConnections' },
		'$$blockheadFarcasterAccountConnections'
	)
	deleteLocalEntityFields(
		context,
		EntityType.BlockheadFarcasterAccountConnection,
		entitySelector
	)
	deleteLocalPresence(context, EntityType.BlockheadFarcasterAccountConnection, entitySelector)
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
	deleteLocalEntityReferenceFieldRows(
		context,
		EntityType.BlockheadSocialPostSession,
		entitySelector,
		'$walletConnection'
	)
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
	deleteLocalEntityReferenceFieldRows(
		context,
		EntityType.BlockheadSocialPostSession,
		entitySelector,
		'$agentConversation'
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
	deleteLocalEntityReferenceFieldRows(
		context,
		EntityType.BlockheadSocialPostSession,
		entitySelector,
		'$$media'
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
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType.BlockheadSocialPostSession,
		entitySelector,
		'$$media'
	)
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
	deleteLocalEntityReferenceFieldRows(
		context,
		EntityType.BlockheadLocalMediaIngest,
		entitySelector,
		'$media'
	)
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
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType._Global,
		{ scope: '$$blockheadLocalMediaIngests' },
		'$$blockheadLocalMediaIngests'
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
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType.BlockheadLocalMediaIngest,
		ingestSelector,
		'$$timestamps'
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
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType.BlockheadWalletRequest,
		walletRequestSelector,
		'$$timestamps'
	)
}

export const writeLocalBlockheadWalletRequest = async (
	context: LocalMutationContext,
	request: LocalBlockheadWalletRequest
) => {
	const entitySelector = {
		id: request.id,
	}
	writeLocalPresence(context, EntityType.BlockheadWalletRequest, entitySelector)
	deleteLocalEntityReferenceFieldRows(
		context,
		EntityType.BlockheadWalletRequest,
		entitySelector,
		'$sessionAction'
	)
	deleteLocalEntityReferenceFieldRows(
		context,
		EntityType.BlockheadWalletRequest,
		entitySelector,
		'$intentOrder'
	)
	deleteLocalEntityReferenceFieldRows(
		context,
		EntityType.BlockheadWalletRequest,
		entitySelector,
		'$walletConnection'
	)
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
	deleteLocalEntityReferenceFieldRows(
		context,
		EntityType.BlockheadWalletRequest,
		entitySelector,
		'$$calls'
	)
	request.calls?.forEach((call) => (
		writeLocalBlockheadWalletRequestCall(context, {
			...call,
			walletRequestId: request.id,
		})
	))
	deleteLocalEntityReferenceFieldRows(
		context,
		EntityType.BlockheadWalletRequest,
		entitySelector,
		'$$timestamps'
	)
	request.timestamps?.forEach((observation) => (
		writeLocalBlockheadWalletRequest_Timestamp(context, {
			...observation,
			walletRequestId: request.id,
		})
	))
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType.BlockheadWalletRequest,
		entitySelector,
		'$$calls'
	)
	writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$blockheadWalletRequests' },
		'$$blockheadWalletRequests',
		entitySelector
	)
	writeLocalEntityReferenceFieldCount(
		context,
		EntityType._Global,
		{ scope: '$$blockheadWalletRequests' },
		'$$blockheadWalletRequests'
	)
	await Promise.all([
		context.entityCollections[EntityType.BlockheadWalletRequest].utils.waitForPersistence(),
		...[
			'$sessionAction',
			'$intentOrder',
			'$walletConnection',
			'id',
			'walletProtocol',
			'caip10',
			'requestKind',
			'requestMethod',
			'chainId',
			'fromAddress',
			'toAddress',
			'value',
			'callCount',
			'atomicRequired',
			'requestPayloadHash',
			'walletCallBundleId',
			'requestedAt',
			'submittedAt',
			'$$calls',
			'$$timestamps',
		].map((fieldName) => (
			context.entityFieldCollections[EntityType.BlockheadWalletRequest][
				entityFieldAddressKey(EntityType.BlockheadWalletRequest, [], fieldName)
			].utils.waitForPersistence()
		)),
		context.entityFieldCountCollections[EntityType.BlockheadWalletRequest][
			entityFieldAddressKey(EntityType.BlockheadWalletRequest, [], '$$calls')
		]?.utils.waitForPersistence(),
		...(
			request.calls?.length ? [
				context.entityCollections[EntityType.BlockheadWalletRequestCall].utils.waitForPersistence(),
				...[
					'$walletRequest',
					'callIndex',
					'caip2',
					'toAddress',
					'value',
					'inputDataHash',
				].map((fieldName) => (
					context.entityFieldCollections[EntityType.BlockheadWalletRequestCall][
						entityFieldAddressKey(EntityType.BlockheadWalletRequestCall, [], fieldName)
					].utils.waitForPersistence()
				)),
			]
			: []
		),
		...(
			request.timestamps?.length ? [
				context.entityCollections[EntityType.BlockheadWalletRequest_Timestamp].utils.waitForPersistence(),
				...[
					'$walletRequest',
					'timestampMs',
					'source',
					'status',
					'walletStatusCode',
					'walletCallBundleStatus',
					'atomic',
					'receiptCount',
					'transactionHash',
					'transactionId',
					'signatureHash',
					'statusPayloadHash',
					'error',
				].map((fieldName) => (
					context.entityFieldCollections[EntityType.BlockheadWalletRequest_Timestamp][
						entityFieldAddressKey(EntityType.BlockheadWalletRequest_Timestamp, [], fieldName)
					].utils.waitForPersistence()
				)),
				context.entityFieldCountCollections[EntityType.BlockheadWalletRequest][
					entityFieldAddressKey(EntityType.BlockheadWalletRequest, [], '$$timestamps')
				]?.utils.waitForPersistence(),
			]
			: []
		),
		context.entityFieldCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletRequests')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletRequests')
		]?.utils.waitForPersistence(),
	])
}
