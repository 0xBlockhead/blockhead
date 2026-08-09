import {
	type ActionType,
	actionTypeDefinitionByActionType,
} from '$/constants/actions.ts'
import type { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { walletConnectionMethodByProtocolDiscoveryKindTransportKind } from '$/constants/Wallet.ts'
import type { WalletConnection } from '$/state/wallets/adapters/types.ts'
import { resolveWalletPrepSelection } from '$/state/wallets/walletRequestPreparation.ts'
import {
	type PersistedWalletConnection,
	walletConnectionPersistRoundTrip,
} from '$/state/wallets/walletConnectionState.ts'
import {
	farcasterAccountConnectionFromPersisted,
	persistFarcasterAccountConnection,
	type FarcasterAccountConnection,
	type PersistedFarcasterAccountConnection,
} from '$/state/farcaster/farcasterAccountConnectionState.ts'
import {
	applySessionCapabilityGrantUpdate,
	applySessionLifecycleUpdate,
	canRemoveSessionLifecycle,
	draftSessionLifecycle,
	isEditableSessionLifecycle,
	lockSessionLifecycle,
	persistSessionCapabilityGrant,
	persistSessionLifecycle,
	removeSessionCapabilityGrantsForConnection,
	sessionCapabilityGrantFromPersisted,
	sessionLifecycleFromPersisted,
	sessionLifecyclePersistRoundTrip,
	unlockSessionLifecycle,
	type PersistedSessionCapabilityGrant,
	type PersistedSessionLifecycle,
	type SessionCapabilityGrant,
	type SessionLifecycle,
} from '$/state/sessions/sessionLifecycleState.ts'
import {
	localMutationAuthorityKey,
	type MutationCollection,
} from '$/client/$client.svelte.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSessionStatus.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
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
import type {
	Entity,
	EntityFieldValues,
	EntitySelector,
} from '$/schema/$schema.ts'
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
	[EntityMetaKey.Value]: LocalPrimitiveFieldValue
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

const sessionActionCreationQueueByKey = new Map<string, Promise<void>>()

const withSessionActionCreationLock = <_Result>(
	sessionSelectorKey: string,
	create: () => Promise<_Result>
) => {
	const lockName = `blockhead:session-action-sequence:${sessionSelectorKey}`
	if (typeof window !== 'undefined')
		return navigator.locks.request(lockName, create)

	const creation = (sessionActionCreationQueueByKey.get(lockName) ?? Promise.resolve())
		.catch(() => {})
		.then(create)
	const queuedCreation = creation.then(
		() => undefined,
		() => undefined
	)
	sessionActionCreationQueueByKey.set(lockName, queuedCreation)
	return creation.finally(() => {
		if (sessionActionCreationQueueByKey.get(lockName) === queuedCreation)
			sessionActionCreationQueueByKey.delete(lockName)
	})
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

type LocalPrimitiveFieldValue =
	| object
	| string
	| number
	| boolean
	| bigint
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
type LocalBlockheadWalletRequestCall = Omit<
	EntityFieldValues<typeof schema, EntityType.BlockheadWalletRequestCall>,
	'$evmRequest' | 'callIndex'
>
type LocalBlockheadWalletRequest_Timestamp = Omit<
	EntityFieldValues<typeof schema, EntityType.BlockheadWalletRequest_Timestamp>,
	'$$evmTransactions' | '$walletRequest'
>
type LocalBlockheadWalletRequest_TimestampInput = LocalBlockheadWalletRequest_Timestamp & {
	evmTransactions?: readonly EntitySelector<typeof schema, EntityType.EvmTransaction>[]
}
type LocalBlockheadEvmWalletRequest = {
	network: EntitySelector<typeof schema, EntityType.Network>
	simulation?: EntitySelector<typeof schema, EntityType.BlockheadSessionSimulation>
	calls: readonly LocalBlockheadWalletRequestCall[]
}
type LocalBlockheadWalletRequest = Omit<
	EntityFieldValues<typeof schema, EntityType.BlockheadWalletRequest>,
	| '$$timestamps'
	| '$account'
	| '$evmRequest'
	| '$intentOrder'
	| '$sessionAction'
	| '$walletConnection'
	| 'submittedAt'
> & {
	sessionAction?: EntitySelector<typeof schema, EntityType.BlockheadSessionAction>
	intentOrder?: EntitySelector<typeof schema, EntityType.BlockheadIntentOrder>
	walletConnection: EntitySelector<typeof schema, EntityType.BlockheadWalletConnection>
	account?: EntitySelector<typeof schema, EntityType.Account>
	evm?: LocalBlockheadEvmWalletRequest
}
type LocalBlockheadActionReadinessCheck = Omit<
	EntityFieldValues<typeof schema, EntityType.BlockheadActionReadinessCheck>,
	'$$timestamps' | '$sessionAction' | 'sessionId' | 'actionId'
>
type LocalBlockheadActionReadinessCheck_Timestamp = Omit<
	EntityFieldValues<typeof schema, EntityType.BlockheadActionReadinessCheck_Timestamp>,
	'$readinessCheck'
>
type LocalBlockheadSessionSimulation = Omit<
	EntityFieldValues<typeof schema, EntityType.BlockheadSessionSimulation>,
	'$$calls' | '$$logs' | '$session'
>
type LocalBlockheadSessionSimulationCall = Omit<
	EntityFieldValues<typeof schema, EntityType.BlockheadSessionSimulationCall>,
	'$simulation' | 'simulationId'
>
type LocalBlockheadTransferIntent = Omit<
	EntityFieldValues<typeof schema, EntityType.BlockheadTransferIntent>,
	'$sessionAction'
>
type LocalBlockheadSwapIntent = Omit<
	EntityFieldValues<typeof schema, EntityType.BlockheadSwapIntent>,
	'$$quotes' | '$sessionAction'
>
type LocalBlockheadIntentQuote = Omit<
	EntityFieldValues<typeof schema, EntityType.BlockheadIntentQuote>,
	'$$timestamps' | '$sessionAction' | 'requestSummary'
> & {
	requestSummary?: object
}
type LocalBlockheadIntentQuote_Timestamp = Omit<
	EntityFieldValues<typeof schema, EntityType.BlockheadIntentQuote_Timestamp>,
	'$quote' | 'inputPreview' | 'outputPreview'
> & {
	inputPreview?: object
	outputPreview?: object
}
type LocalBlockheadIntentInvocation = Omit<
	EntityFieldValues<typeof schema, EntityType.BlockheadIntentInvocation>,
	'$createdAction' | '$session' | 'sourceSelector' | 'targetSelector'
> & {
	createdAction?: EntitySelector<typeof schema, EntityType.BlockheadSessionAction>
	sourceSelector?: object
	targetSelector?: object
}
type LocalBlockheadActionOutcome = Omit<
	EntityFieldValues<typeof schema, EntityType.BlockheadActionOutcome>,
	'$$evmTransactions' | '$intentOrder' | '$sessionAction' | '$simulation' | '$walletRequest' | '$$timestamps'
> & {
	intentOrder?: EntitySelector<typeof schema, EntityType.BlockheadIntentOrder>
	simulation?: EntitySelector<typeof schema, EntityType.BlockheadSessionSimulation>
	walletRequest?: EntitySelector<typeof schema, EntityType.BlockheadWalletRequest>
	evmTransactions?: readonly EntitySelector<typeof schema, EntityType.EvmTransaction>[]
}
type LocalBlockheadActionOutcome_Timestamp = Omit<
	EntityFieldValues<typeof schema, EntityType.BlockheadActionOutcome_Timestamp>,
	'$outcome'
>

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
	return collection.utils.writeUpsertWithAuthority({
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
		authority.resolution,
		() => writeLocalEntityReferenceFieldCount(
			context,
			entityType,
			entitySelector,
			fieldName
		)
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
		return Promise.resolve()

	countCollection.startSyncImmediate()
	const authority = localMutationAuthority(entityType, entitySelector, {
		fieldName,
		facetPathKey: stringify([]),
		filterKey: stringify({}),
		resolution: 'resolved',
	})
	const countApplication = countCollection.utils.writeUpsertWithAuthority({
		[EntityMetaKey.ParentSelector]: entitySelector,
		[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: new Set(fieldCollection.toArray
			.filter((row) => (
				row[EntityMetaKey.Source] === Source.Local_Internal
				&& row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
				&& row.facetPathKey === stringify([])
			))
			.map((row) => row.valueKey)
		).size,
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
	return Promise.all([
		countApplication,
		fieldCollection.utils.replaceRowsWithAuthority(
			() => false,
			[],
			fieldAuthority.selectorKey,
			fieldAuthority.authorityKey,
			fieldAuthority.resolution
		),
	]).then(() => {})
}

const deleteLocalEntityReferenceField = (
	context: LocalMutationContext,
	entityType: EntityType,
	entitySelector: object,
	fieldName: string,
	referencedEntitySelector: object
) => {
	const collection = context.entityFieldCollections[entityType][entityFieldAddressKey(entityType, [], fieldName)]
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
	collection.startSyncImmediate()
	return collection.utils.replaceRowsWithAuthority(
		(row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
				&& row[EntityMetaKey.ParentSelectorKey] === entitySelectorKey(schema, entityDefinitionByType[entityType], entitySelector)
				&& row.valueKey === valueKey
		),
		[],
		authority.selectorKey,
		authority.authorityKey,
		authority.resolution,
		() => writeLocalEntityReferenceFieldCount(
			context,
			entityType,
			entitySelector,
			fieldName
		)
	)
}

const replaceLocalEntityReferenceFieldRows = (
	context: LocalMutationContext,
	entityType: EntityType,
	entitySelector: object,
	fieldName: string,
	referencedEntitySelectors: readonly object[]
) => {
	const collection = context.entityFieldCollections[entityType][entityFieldAddressKey(entityType, [], fieldName)]
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
	collection.startSyncImmediate()
	return collection.utils.replaceRowsWithAuthority(
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
		authority.resolution,
		() => writeLocalEntityReferenceFieldCount(
			context,
			entityType,
			entitySelector,
			fieldName
		)
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
}

const localPrimitiveFieldValue = (
	context: LocalMutationContext,
	entityType: EntityType,
	entitySelector: object,
	fieldName: string
) => {
	const parentSelectorKey = entitySelectorKey(schema, entityDefinitionByType[entityType], entitySelector)
	return context.entityFieldCollections[entityType][
		entityFieldAddressKey(entityType, [], fieldName)
	].toArray.find((row) => (
		row[EntityMetaKey.Source] === Source.Local_Internal
		&& row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
		&& row.facetPathKey === stringify([])
	))?.[EntityMetaKey.Value]
}

const readLocalBlockheadSessionLifecycle = (
	context: LocalMutationContext,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>
): SessionLifecycle | undefined => {
	const statusValue = localPrimitiveFieldValue(context, EntityType.BlockheadSession, entitySelector, 'status')
	const createdAt = localPrimitiveFieldValue(context, EntityType.BlockheadSession, entitySelector, 'createdAt')
	const updatedAt = localPrimitiveFieldValue(context, EntityType.BlockheadSession, entitySelector, 'updatedAt')
	const status = (
		statusValue === BlockheadSessionStatus.Draft
		|| statusValue === BlockheadSessionStatus.Submitted
		|| statusValue === BlockheadSessionStatus.Finalized
	) ?
		statusValue
	:
		undefined
	if (status == null || typeof createdAt !== 'number' || typeof updatedAt !== 'number')
		return undefined

	const name = localPrimitiveFieldValue(context, EntityType.BlockheadSession, entitySelector, 'name')
	const lockedAt = localPrimitiveFieldValue(context, EntityType.BlockheadSession, entitySelector, 'lockedAt')
	return sessionLifecycleFromPersisted({
		id: entitySelector.id,
		...(typeof name === 'string' && { name }),
		status,
		createdAt,
		updatedAt,
		...(typeof lockedAt === 'number' && { lockedAt }),
	})
}

const writeLocalBlockheadSessionLifecycleFields = (
	context: LocalMutationContext,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	session: PersistedSessionLifecycle
) => {
	writeLocalPresence(context, EntityType.BlockheadSession, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadSession, entitySelector, {
		name: session.name,
		status: session.status,
		createdAt: session.createdAt,
		updatedAt: session.updatedAt,
		lockedAt: session.lockedAt,
	})
}

const applyLocalBlockheadSessionLifecycleUpdate = (
	context: LocalMutationContext,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	next: SessionLifecycle
) => {
	const applied = applySessionLifecycleUpdate(
		readLocalBlockheadSessionLifecycle(context, entitySelector),
		next
	)
	writeLocalBlockheadSessionLifecycleFields(
		context,
		entitySelector,
		persistSessionLifecycle(applied)
	)
	return applied
}

const replaceLocalPrimitiveManyField = (
	context: LocalMutationContext,
	entityType: EntityType,
	entitySelector: object,
	fieldName: string,
	values: readonly string[]
) => {
	const collection = context.entityFieldCollections[entityType][entityFieldAddressKey(entityType, [], fieldName)]
	const parentSelectorKey = entitySelectorKey(schema, entityDefinitionByType[entityType], entitySelector)
	const authority = localMutationAuthority(entityType, entitySelector, {
		fieldName,
		facetPathKey: stringify([]),
		resolution: 'resolved',
	})
	collection.startSyncImmediate()
	return collection.utils.replaceRowsWithAuthority(
		(row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
			&& row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
		),
		values.map((value, valueIndex) => ({
			facetPath: [],
			facetPathKey: stringify([]),
			fieldName,
			valueIndex,
			[EntityMetaKey.ParentSelector]: entitySelector,
			[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
			[EntityMetaKey.Source]: Source.Local_Internal,
			[EntityMetaKey.Value]: value,
			valueKey: `Value:${stringify(value)}`,
		})),
		authority.selectorKey,
		authority.authorityKey,
		authority.resolution
	)
}

const readLocalBlockheadWalletCapabilityGrant = (
	context: LocalMutationContext,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadWalletCapabilityGrant>
): SessionCapabilityGrant | undefined => {
	const authorizationKind = localPrimitiveFieldValue(
		context,
		EntityType.BlockheadWalletCapabilityGrant,
		entitySelector,
		'authorizationKind'
	)
	const scope = localPrimitiveFieldValue(
		context,
		EntityType.BlockheadWalletCapabilityGrant,
		entitySelector,
		'scope'
	)
	if (typeof authorizationKind !== 'string' || scope === undefined)
		return undefined

	const parentSelectorKey = entitySelectorKey(
		schema,
		entityDefinitionByType[EntityType.BlockheadWalletCapabilityGrant],
		entitySelector
	)
	const methods = context.entityFieldCollections[EntityType.BlockheadWalletCapabilityGrant][
		entityFieldAddressKey(EntityType.BlockheadWalletCapabilityGrant, [], 'methods')
	].toArray
		.filter((row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
			&& row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
		))
		.sort((left, right) => (left.valueIndex ?? 0) - (right.valueIndex ?? 0))
		.flatMap((row) => (
			typeof row[EntityMetaKey.Value] === 'string' ? [row[EntityMetaKey.Value]] : []
		))
	const resources = context.entityFieldCollections[EntityType.BlockheadWalletCapabilityGrant][
		entityFieldAddressKey(EntityType.BlockheadWalletCapabilityGrant, [], 'resources')
	].toArray
		.filter((row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
			&& row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
		))
		.sort((left, right) => (left.valueIndex ?? 0) - (right.valueIndex ?? 0))
		.flatMap((row) => (
			typeof row[EntityMetaKey.Value] === 'string' ? [row[EntityMetaKey.Value]] : []
		))
	const connectionRow = context.entityFieldCollections[EntityType.BlockheadWalletCapabilityGrant][
		entityFieldAddressKey(EntityType.BlockheadWalletCapabilityGrant, [], '$connection')
	].toArray.find((row) => (
		row[EntityMetaKey.Source] === Source.Local_Internal
		&& row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
	))
	const connectionSelector = Object(Object.getOwnPropertyDescriptor(
		Object(connectionRow?.[EntityMetaKey.Value]),
		EntityMetaKey.Selector
	)?.value)
	const connectionKey = (
		typeof connectionSelector.connectionKey === 'string' ?
			connectionSelector.connectionKey
		:
			undefined
	)
	const issuedAt = localPrimitiveFieldValue(context, EntityType.BlockheadWalletCapabilityGrant, entitySelector, 'issuedAt')
	const notBefore = localPrimitiveFieldValue(context, EntityType.BlockheadWalletCapabilityGrant, entitySelector, 'notBefore')
	const expiresAt = localPrimitiveFieldValue(context, EntityType.BlockheadWalletCapabilityGrant, entitySelector, 'expiresAt')
	const revokedAt = localPrimitiveFieldValue(context, EntityType.BlockheadWalletCapabilityGrant, entitySelector, 'revokedAt')
	const proofKind = localPrimitiveFieldValue(context, EntityType.BlockheadWalletCapabilityGrant, entitySelector, 'proofKind')
	const proofSummary = localPrimitiveFieldValue(context, EntityType.BlockheadWalletCapabilityGrant, entitySelector, 'proofSummary')
	return {
		grantId: entitySelector.grantId,
		...(connectionKey != null && { connectionKey }),
		authorizationKind,
		scope,
		methods,
		resources,
		...(typeof issuedAt === 'number' && { issuedAt }),
		...(typeof notBefore === 'number' && { notBefore }),
		...(typeof expiresAt === 'number' && { expiresAt }),
		...(typeof revokedAt === 'number' && { revokedAt }),
		...(typeof proofKind === 'string' && { proofKind }),
		...(typeof proofSummary === 'string' && { proofSummary }),
	}
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
	const persisted = persistSessionLifecycle(draftSessionLifecycle({
		id: entitySelector.id,
		...(sessionName !== '' && { name: sessionName }),
		createdAt: now,
		updatedAt: now,
	}))
	writeLocalBlockheadSessionLifecycleFields(context, entitySelector, persisted)
	writeLocalPrimitiveFields(context, EntityType.BlockheadSession, entitySelector, {
		simulationCount: undefined,
	})
	const relationshipApplications = [
		deleteLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadSession,
			entitySelector,
			'$latestSimulation'
		),
		...[
			'$$actions',
			'$$intentInvocations',
			'$$simulations',
		].map((fieldName) => deleteLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadSession,
			entitySelector,
			fieldName
		)),
	]
	relationshipApplications.push(writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		parentEntitySelector,
		'$$blockheadSessions',
		entitySelector
	))
	await Promise.all([
		...relationshipApplications,
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
		context.entityFieldCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadSessions')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadSessions')
		]?.utils.waitForPersistence(),
	])

	return entitySelector
}

/** Reload/upsert path: coerce flat OPFS rows, then monotonic `updatedAt` wins over stale races. */
export const writeLocalBlockheadSessionLifecycle = async (
	context: LocalMutationContext,
	parentEntitySelector: EntitySelector<typeof schema, EntityType._Global>,
	session: PersistedSessionLifecycle | SessionLifecycle
) => {
	const entitySelector = {
		id: session.id,
	}
	const coerced = sessionLifecycleFromPersisted(sessionLifecyclePersistRoundTrip(session))
	const applied = applyLocalBlockheadSessionLifecycleUpdate(context, entitySelector, coerced)
	const relationshipApplication = writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		parentEntitySelector,
		'$$blockheadSessions',
		entitySelector
	)
	await Promise.all([
		relationshipApplication,
		context.entityCollections[EntityType.BlockheadSession].utils.waitForPersistence(),
		...[
			'name',
			'status',
			'createdAt',
			'updatedAt',
			'lockedAt',
		].map((fieldName) => (
			context.entityFieldCollections[EntityType.BlockheadSession][
				entityFieldAddressKey(EntityType.BlockheadSession, [], fieldName)
			].utils.waitForPersistence()
		)),
		context.entityFieldCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadSessions')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadSessions')
		]?.utils.waitForPersistence(),
	])
	return persistSessionLifecycle(applied)
}

export const writeLocalBlockheadSessionName = (
	context: LocalMutationContext,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	sessionName: string
) => {
	const previous = readLocalBlockheadSessionLifecycle(context, entitySelector)
	if (previous == null || !isEditableSessionLifecycle(previous))
		return

	applyLocalBlockheadSessionLifecycleUpdate(
		context,
		entitySelector,
		draftSessionLifecycle({
			id: previous.id,
			...(sessionName !== '' && { name: sessionName }),
			createdAt: previous.createdAt,
			updatedAt: Date.now(),
			...(previous.lockedAt != null && { lockedAt: previous.lockedAt }),
		})
	)
}

export const writeLocalBlockheadSessionAction = (
	context: LocalMutationContext,
	sessionEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	actionType: ActionType,
	actionParams?: object
) => {
	const validatedActionParams = actionTypeDefinitionByActionType[actionType].params.assert(actionParams ?? {})
	const sessionSelectorKey = entitySelectorKey(
		schema,
		entityDefinitionByType[EntityType.BlockheadSession],
		sessionEntitySelector
	)
	return withSessionActionCreationLock(sessionSelectorKey, async () => {
		const actionsCollection = context.entityFieldCollections[EntityType.BlockheadSession][
			entityFieldAddressKey(EntityType.BlockheadSession, [], '$$actions')
		]
		actionsCollection.startSyncImmediate()
		await actionsCollection.utils.waitForPersistence()
		const indexInSequence = Math.max(
			actionsCollection.toArray.reduce((highestIndexInSequence, action) => (
				action[EntityMetaKey.Source] === Source.Local_Internal
				&& action[EntityMetaKey.ParentSelectorKey] === sessionSelectorKey
				&& action.valueIndex !== undefined ?
					Math.max(highestIndexInSequence, action.valueIndex)
				:
					highestIndexInSequence
			), -1) + 1,
			typeof window === 'undefined' ?
				0
			:
				Number(window.localStorage.getItem(`blockhead:session-action-next-index:${sessionSelectorKey}`))
		)
		if (typeof window !== 'undefined')
			window.localStorage.setItem(
				`blockhead:session-action-next-index:${sessionSelectorKey}`,
				String(indexInSequence + 1)
			)
		const now = Date.now()
		const entitySelector = {
			sessionId: sessionEntitySelector.id,
			actionId: globalThis.crypto.randomUUID(),
		}
		writeLocalPresence(context, EntityType.BlockheadSessionAction, entitySelector)
		const relationshipApplications = [
			writeLocalEntityReferenceField(
				context,
				EntityType.BlockheadSessionAction,
				entitySelector,
				'$session',
				sessionEntitySelector
			),
		]
		writeLocalPrimitiveFields(context, EntityType.BlockheadSessionAction, entitySelector, {
			indexInSequence,
			actionType,
			actionParams: validatedActionParams,
			createdAt: now,
			updatedAt: now,
		})
		relationshipApplications.push(writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadSession,
			sessionEntitySelector,
			'$$actions',
			entitySelector,
			indexInSequence
		))
		const previousSession = readLocalBlockheadSessionLifecycle(context, sessionEntitySelector)
		if (previousSession != null) {
			applyLocalBlockheadSessionLifecycleUpdate(
				context,
				sessionEntitySelector,
				sessionLifecycleFromPersisted({
					...persistSessionLifecycle(previousSession),
					updatedAt: now,
				})
			)
		}
		await Promise.all([
			...relationshipApplications,
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
			actionsCollection.utils.waitForPersistence(),
			context.entityFieldCollections[EntityType.BlockheadSession][
				entityFieldAddressKey(EntityType.BlockheadSession, [], 'updatedAt')
			].utils.waitForPersistence(),
			context.entityFieldCountCollections[EntityType.BlockheadSession][
				entityFieldAddressKey(EntityType.BlockheadSession, [], '$$actions')
			]?.utils.waitForPersistence(),
		])
	})
}

export const writeLocalBlockheadSessionLockedAt = (
	context: LocalMutationContext,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	lockedAt: number | undefined
) => {
	if (lockedAt === undefined)
		return

	const previous = readLocalBlockheadSessionLifecycle(context, entitySelector)
	if (previous == null)
		return

	const next = lockSessionLifecycle(previous, lockedAt, Date.now())
	if (next == null)
		return

	applyLocalBlockheadSessionLifecycleUpdate(context, entitySelector, next)
}

export const deleteLocalBlockheadSessionLockedAt = (
	context: LocalMutationContext,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>
) => {
	const previous = readLocalBlockheadSessionLifecycle(context, entitySelector)
	if (previous == null)
		return

	const next = unlockSessionLifecycle(previous, Date.now())
	if (next == null)
		return

	applyLocalBlockheadSessionLifecycleUpdate(context, entitySelector, next)
}

export const deleteLocalBlockheadSession = (
	context: LocalMutationContext,
	parentEntitySelector: EntitySelector<typeof schema, EntityType._Global>,
	entitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>
) => {
	const previous = readLocalBlockheadSessionLifecycle(context, entitySelector)
	if (previous != null && !canRemoveSessionLifecycle(previous))
		throw new Error(`BlockheadSession ${entitySelector.id} is not removable (status ${previous.status})`)

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
	const relationshipApplication = deleteLocalEntityReferenceField(
		context,
		EntityType._Global,
		parentEntitySelector,
		'$$blockheadSessions',
		entitySelector
	)
	deleteLocalEntityFields(context, EntityType.BlockheadSession, entitySelector)
	deleteLocalPresence(context, EntityType.BlockheadSession, entitySelector)
	return Promise.all([
		relationshipApplication,
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
	const relationshipApplication = deleteLocalEntityReferenceField(
		context,
		EntityType.BlockheadSession,
		sessionEntitySelector,
		'$$actions',
		entitySelector
	)
	await Promise.all([
		relationshipApplication,
		context.entityFieldCollections[EntityType.BlockheadSession][
			entityFieldAddressKey(EntityType.BlockheadSession, [], '$$actions')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType.BlockheadSession][
			entityFieldAddressKey(EntityType.BlockheadSession, [], '$$actions')
		]?.utils.waitForPersistence(),
	])
	deleteLocalEntityFields(context, EntityType.BlockheadSessionAction, entitySelector)
	const previousSession = readLocalBlockheadSessionLifecycle(context, sessionEntitySelector)
	if (previousSession != null) {
		applyLocalBlockheadSessionLifecycleUpdate(
			context,
			sessionEntitySelector,
			sessionLifecycleFromPersisted({
				...persistSessionLifecycle(previousSession),
				updatedAt: Date.now(),
			})
		)
	}
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

export const writeLocalBlockheadWalletCapabilityGrant = async (
	context: LocalMutationContext,
	grant: SessionCapabilityGrant | PersistedSessionCapabilityGrant,
	now = Date.now()
) => {
	const entitySelector = {
		grantId: grant.grantId,
	}
	const hydrated = sessionCapabilityGrantFromPersisted(grant, now)
	const applied = applySessionCapabilityGrantUpdate(
		readLocalBlockheadWalletCapabilityGrant(context, entitySelector),
		hydrated
	)
	const persisted = persistSessionCapabilityGrant(applied)
	writeLocalPresence(context, EntityType.BlockheadWalletCapabilityGrant, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadWalletCapabilityGrant, entitySelector, {
		grantId: persisted.grantId,
		authorizationKind: persisted.authorizationKind,
		scope: persisted.scope,
		issuedAt: persisted.issuedAt,
		notBefore: persisted.notBefore,
		expiresAt: persisted.expiresAt,
		revokedAt: persisted.revokedAt,
		proofKind: persisted.proofKind,
		proofSummary: persisted.proofSummary,
	})
	const relationshipApplications = [
		replaceLocalPrimitiveManyField(
			context,
			EntityType.BlockheadWalletCapabilityGrant,
			entitySelector,
			'methods',
			persisted.methods
		),
		replaceLocalPrimitiveManyField(
			context,
			EntityType.BlockheadWalletCapabilityGrant,
			entitySelector,
			'resources',
			persisted.resources
		),
		(
			persisted.connectionKey == null ?
				deleteLocalEntityReferenceFieldRows(
					context,
					EntityType.BlockheadWalletCapabilityGrant,
					entitySelector,
					'$connection'
				)
			:
				writeLocalEntityReferenceField(
					context,
					EntityType.BlockheadWalletCapabilityGrant,
					entitySelector,
					'$connection',
					{
						connectionKey: persisted.connectionKey,
					}
				)
		),
		writeLocalEntityReferenceField(
			context,
			EntityType._Global,
			{ scope: '$$blockheadWalletCapabilityGrants' },
			'$$blockheadWalletCapabilityGrants',
			entitySelector
		),
	]
	await Promise.all([
		...relationshipApplications,
		context.entityCollections[EntityType.BlockheadWalletCapabilityGrant].utils.waitForPersistence(),
		...[
			'grantId',
			'authorizationKind',
			'scope',
			'issuedAt',
			'notBefore',
			'expiresAt',
			'revokedAt',
			'proofKind',
			'proofSummary',
			'methods',
			'resources',
			'$connection',
		].map((fieldName) => (
			context.entityFieldCollections[EntityType.BlockheadWalletCapabilityGrant][
				entityFieldAddressKey(EntityType.BlockheadWalletCapabilityGrant, [], fieldName)
			].utils.waitForPersistence()
		)),
		context.entityFieldCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletCapabilityGrants')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletCapabilityGrants')
		]?.utils.waitForPersistence(),
	])
	return persisted
}

export const deleteLocalBlockheadWalletCapabilityGrant = async (
	context: LocalMutationContext,
	grantId: string
) => {
	const entitySelector = {
		grantId,
	}
	const relationshipApplication = deleteLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$blockheadWalletCapabilityGrants' },
		'$$blockheadWalletCapabilityGrants',
		entitySelector
	)
	deleteLocalEntityFields(context, EntityType.BlockheadWalletCapabilityGrant, entitySelector)
	deleteLocalPresence(context, EntityType.BlockheadWalletCapabilityGrant, entitySelector)
	await Promise.all([
		relationshipApplication,
		context.entityCollections[EntityType.BlockheadWalletCapabilityGrant].utils.waitForPersistence(),
		...Object.values(context.entityFieldCollections[EntityType.BlockheadWalletCapabilityGrant])
			.map((collection) => collection.utils.waitForPersistence()),
		...Object.values(context.entityFieldCountCollections[EntityType.BlockheadWalletCapabilityGrant])
			.flatMap((collection) => collection === undefined ? [] : [collection.utils.waitForPersistence()]),
		context.entityFieldCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletCapabilityGrants')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletCapabilityGrants')
		]?.utils.waitForPersistence(),
	])
}

export const deleteLocalBlockheadWalletCapabilityGrantsForConnection = async (
	context: LocalMutationContext,
	connectionKey: string,
	revokedAt = Date.now()
) => {
	const parentSelectorKey = entitySelectorKey(
		schema,
		entityDefinitionByType[EntityType._Global],
		{ scope: '$$blockheadWalletCapabilityGrants' }
	)
	const grants = context.entityFieldCollections[EntityType._Global][
		entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletCapabilityGrants')
	].toArray
		.filter((row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
			&& row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
		))
		.flatMap((row) => {
			const grantSelector = Object(Object.getOwnPropertyDescriptor(
				Object(row[EntityMetaKey.Value]),
				EntityMetaKey.Selector
			)?.value)
			if (typeof grantSelector.grantId !== 'string')
				return []

			const grant = readLocalBlockheadWalletCapabilityGrant(context, {
				grantId: grantSelector.grantId,
			})
			return grant == null ? [] : [grant]
		})
	await Promise.all(
		removeSessionCapabilityGrantsForConnection(
			grants,
			connectionKey,
			revokedAt
		)
			.filter((grant) => grant.connectionKey === connectionKey)
			.map((grant) => writeLocalBlockheadWalletCapabilityGrant(
				context,
				grant,
				revokedAt
			))
	)
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
	const relationshipApplication = writeLocalEntityReferenceField(
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
		relationshipApplication,
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

export const writeLocalBlockheadTransferIntent = async (
	context: LocalMutationContext,
	intent: LocalBlockheadTransferIntent
) => {
	const entitySelector = {
		sessionId: intent.sessionId,
		actionId: intent.actionId,
	}
	const primitiveFields = {
		sessionId: intent.sessionId,
		actionId: intent.actionId,
		fromCaip10: intent.fromCaip10,
		toCaip10: intent.toCaip10,
		networkCaip2: intent.networkCaip2,
		assetCaip19: intent.assetCaip19,
		fromAddress: intent.fromAddress,
		toAddress: intent.toAddress,
		chainId: intent.chainId,
		tokenAddress: intent.tokenAddress,
		amount: intent.amount,
	}
	const relationshipSelectors = [
		[
			'$sessionAction',
			{
				sessionId: intent.sessionId,
				actionId: intent.actionId,
			},
		],
		[
			'$fromAccount',
			intent.$fromAccount?.[EntityMetaKey.Selector],
		],
		[
			'$toAccount',
			intent.$toAccount?.[EntityMetaKey.Selector],
		],
		[
			'$from',
			intent.$from?.[EntityMetaKey.Selector],
		],
		[
			'$to',
			intent.$to?.[EntityMetaKey.Selector],
		],
		[
			'$network',
			intent.$network?.[EntityMetaKey.Selector],
		],
		[
			'$evmNetwork',
			intent.$evmNetwork?.[EntityMetaKey.Selector],
		],
		[
			'$token',
			intent.$token?.[EntityMetaKey.Selector],
		],
	] satisfies [string, object | undefined][]
	writeLocalPresence(context, EntityType.BlockheadTransferIntent, entitySelector)
	writeLocalPrimitiveFields(
		context,
		EntityType.BlockheadTransferIntent,
		entitySelector,
		primitiveFields
	)
	await Promise.all(relationshipSelectors.map(([fieldName, referencedEntitySelector]) => (
		replaceLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadTransferIntent,
			entitySelector,
			fieldName,
			referencedEntitySelector === undefined ? [] : [referencedEntitySelector]
		)
	)))
	await Promise.all([
		context.entityCollections[EntityType.BlockheadTransferIntent].utils.waitForPersistence(),
		...Object.keys(primitiveFields).map((fieldName) => (
			context.entityFieldCollections[EntityType.BlockheadTransferIntent][
				entityFieldAddressKey(EntityType.BlockheadTransferIntent, [], fieldName)
			].utils.waitForPersistence()
		)),
		...relationshipSelectors.map(([fieldName]) => (
			context.entityFieldCollections[EntityType.BlockheadTransferIntent][
				entityFieldAddressKey(EntityType.BlockheadTransferIntent, [], fieldName)
			].utils.waitForPersistence()
		)),
	])

	return entitySelector
}

export const writeLocalBlockheadSwapIntent = async (
	context: LocalMutationContext,
	intent: LocalBlockheadSwapIntent
) => {
	const entitySelector = {
		sessionId: intent.sessionId,
		actionId: intent.actionId,
	}
	const primitiveFields = {
		sessionId: intent.sessionId,
		actionId: intent.actionId,
		networkCaip2: intent.networkCaip2,
		assetInCaip19: intent.assetInCaip19,
		assetOutCaip19: intent.assetOutCaip19,
		chainId: intent.chainId,
		tokenInAddress: intent.tokenInAddress,
		tokenOutAddress: intent.tokenOutAddress,
		amount: intent.amount,
		slippage: intent.slippage,
	}
	const relationshipSelectors = [
		[
			'$sessionAction',
			entitySelector,
		],
		[
			'$network',
			intent.$network?.[EntityMetaKey.Selector],
		],
		[
			'$evmNetwork',
			intent.$evmNetwork?.[EntityMetaKey.Selector],
		],
		[
			'$tokenIn',
			intent.$tokenIn?.[EntityMetaKey.Selector],
		],
		[
			'$tokenOut',
			intent.$tokenOut?.[EntityMetaKey.Selector],
		],
	] satisfies [string, object | undefined][]
	writeLocalPresence(context, EntityType.BlockheadSwapIntent, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadSwapIntent, entitySelector, primitiveFields)
	await Promise.all(relationshipSelectors.map(([fieldName, referencedEntitySelector]) => (
		replaceLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadSwapIntent,
			entitySelector,
			fieldName,
			referencedEntitySelector === undefined ? [] : [referencedEntitySelector]
		)
	)))
	await Promise.all([
		context.entityCollections[EntityType.BlockheadSwapIntent].utils.waitForPersistence(),
		...[
			...Object.keys(primitiveFields),
			...relationshipSelectors.map(([fieldName]) => fieldName),
		].map((fieldName) => context.entityFieldCollections[EntityType.BlockheadSwapIntent][
			entityFieldAddressKey(EntityType.BlockheadSwapIntent, [], fieldName)
		].utils.waitForPersistence()),
	])

	return entitySelector
}

export const writeLocalBlockheadIntentQuote = async (
	context: LocalMutationContext,
	sessionActionSelector: EntitySelector<typeof schema, EntityType.BlockheadSessionAction>,
	swapIntentSelector: EntitySelector<typeof schema, EntityType.BlockheadSwapIntent>,
	quote: LocalBlockheadIntentQuote,
	observation: LocalBlockheadIntentQuote_Timestamp
) => {
	const quoteSelector = {
		id: quote.id,
	}
	const observationSelector = {
		$quote: quoteSelector,
		timestampMs: observation.timestampMs,
		source: observation.source,
	}
	writeLocalPresence(context, EntityType.BlockheadIntentQuote, quoteSelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadIntentQuote, quoteSelector, {
		id: quote.id,
		source: quote.source,
		quoteRequestHash: quote.quoteRequestHash,
		providerProtocol: quote.providerProtocol,
		intentType: quote.intentType,
		userInteropAddress: quote.userInteropAddress,
		requestedAt: quote.requestedAt,
		requestPayloadHash: quote.requestPayloadHash,
		requestSummary: quote.requestSummary,
	})
	writeLocalPresence(context, EntityType.BlockheadIntentQuote_Timestamp, observationSelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadIntentQuote_Timestamp, observationSelector, {
		timestampMs: observation.timestampMs,
		source: observation.source,
		quoteId: observation.quoteId,
		solverId: observation.solverId,
		validUntil: observation.validUntil,
		estimatedFillSeconds: observation.estimatedFillSeconds,
		inputPreview: observation.inputPreview,
		outputPreview: observation.outputPreview,
		quotePayloadHash: observation.quotePayloadHash,
		integrityChecksum: observation.integrityChecksum,
		error: observation.error,
	})
	await Promise.all([
		replaceLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadIntentQuote,
			quoteSelector,
			'$sessionAction',
			[sessionActionSelector]
		),
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadSessionAction,
			sessionActionSelector,
			'$$quotes',
			quoteSelector
		),
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadSwapIntent,
			swapIntentSelector,
			'$$quotes',
			quoteSelector
		),
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadIntentQuote_Timestamp,
			observationSelector,
			'$quote',
			quoteSelector
		),
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadIntentQuote,
			quoteSelector,
			'$$timestamps',
			observationSelector
		),
	])
	await Promise.all([
		context.entityCollections[EntityType.BlockheadIntentQuote].utils.waitForPersistence(),
		context.entityCollections[EntityType.BlockheadIntentQuote_Timestamp].utils.waitForPersistence(),
		...[
			'$sessionAction',
			'$$timestamps',
			'id',
			'source',
			'quoteRequestHash',
			'providerProtocol',
			'intentType',
			'userInteropAddress',
			'requestedAt',
			'requestPayloadHash',
			'requestSummary',
		].map((fieldName) => context.entityFieldCollections[EntityType.BlockheadIntentQuote][
			entityFieldAddressKey(EntityType.BlockheadIntentQuote, [], fieldName)
		].utils.waitForPersistence()),
		...[
			'$quote',
			'timestampMs',
			'source',
			'quoteId',
			'solverId',
			'validUntil',
			'estimatedFillSeconds',
			'inputPreview',
			'outputPreview',
			'quotePayloadHash',
			'integrityChecksum',
			'error',
		].map((fieldName) => context.entityFieldCollections[EntityType.BlockheadIntentQuote_Timestamp][
			entityFieldAddressKey(EntityType.BlockheadIntentQuote_Timestamp, [], fieldName)
		].utils.waitForPersistence()),
	])

	return quoteSelector
}

export const writeLocalBlockheadIntentInvocation = async (
	context: LocalMutationContext,
	sessionEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	invocation: LocalBlockheadIntentInvocation
) => {
	const entitySelector = {
		sessionId: sessionEntitySelector.id,
		invocationId: invocation.invocationId,
	}
	const primitiveFields = {
		sessionId: sessionEntitySelector.id,
		invocationId: invocation.invocationId,
		modality: invocation.modality,
		sourceEntityType: invocation.sourceEntityType,
		sourceSelector: invocation.sourceSelector,
		targetEntityType: invocation.targetEntityType,
		targetSelector: invocation.targetSelector,
		sourcePlacement: invocation.sourcePlacement,
		targetPlacement: invocation.targetPlacement,
		invocationPayloadHash: invocation.invocationPayloadHash,
		resolvedIntentType: invocation.resolvedIntentType,
		intentDefinitionKey: invocation.intentDefinitionKey,
		intentDefinitionHash: invocation.intentDefinitionHash,
		selectedOptionIndex: invocation.selectedOptionIndex,
		selectedOptionHash: invocation.selectedOptionHash,
		createdAt: invocation.createdAt,
	}
	writeLocalPresence(context, EntityType.BlockheadIntentInvocation, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadIntentInvocation, entitySelector, primitiveFields)
	await Promise.all([
		replaceLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadIntentInvocation,
			entitySelector,
			'$session',
			[sessionEntitySelector]
		),
		replaceLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadIntentInvocation,
			entitySelector,
			'$createdAction',
			invocation.createdAction === undefined ? [] : [invocation.createdAction]
		),
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadSession,
			sessionEntitySelector,
			'$$intentInvocations',
			entitySelector
		),
	])
	await Promise.all([
		context.entityCollections[EntityType.BlockheadIntentInvocation].utils.waitForPersistence(),
		...[
			'$session',
			'$createdAction',
			...Object.keys(primitiveFields),
		].map((fieldName) => context.entityFieldCollections[EntityType.BlockheadIntentInvocation][
			entityFieldAddressKey(EntityType.BlockheadIntentInvocation, [], fieldName)
		].utils.waitForPersistence()),
		context.entityFieldCollections[EntityType.BlockheadSession][
			entityFieldAddressKey(EntityType.BlockheadSession, [], '$$intentInvocations')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType.BlockheadSession][
			entityFieldAddressKey(EntityType.BlockheadSession, [], '$$intentInvocations')
		]?.utils.waitForPersistence(),
	])

	return entitySelector
}

export const writeLocalBlockheadActionOutcome = async (
	context: LocalMutationContext,
	sessionActionEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadSessionAction>,
	outcome: LocalBlockheadActionOutcome,
	observation: LocalBlockheadActionOutcome_Timestamp
) => {
	const entitySelector = {
		sessionId: sessionActionEntitySelector.sessionId,
		actionId: sessionActionEntitySelector.actionId,
		outcomeId: outcome.outcomeId,
	}
	const observationEntitySelector = {
		$outcome: entitySelector,
		timestampMs: observation.timestampMs,
		source: observation.source,
	}
	const primitiveFields = {
		sessionId: sessionActionEntitySelector.sessionId,
		actionId: sessionActionEntitySelector.actionId,
		outcomeId: outcome.outcomeId,
		outcomeKind: outcome.outcomeKind,
		transactionId: outcome.transactionId,
		bridgeTransferId: outcome.bridgeTransferId,
		createdAt: outcome.createdAt,
		outcomePayloadHash: outcome.outcomePayloadHash,
	}
	const observationPrimitiveFields = {
		timestampMs: observation.timestampMs,
		source: observation.source,
		status: observation.status,
		finality: observation.finality,
		transactionId: observation.transactionId,
		bridgeTransferId: observation.bridgeTransferId,
		sourcePayloadHash: observation.sourcePayloadHash,
		error: observation.error,
	}
	writeLocalPresence(context, EntityType.BlockheadActionOutcome, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadActionOutcome, entitySelector, primitiveFields)
	writeLocalPresence(context, EntityType.BlockheadActionOutcome_Timestamp, observationEntitySelector)
	writeLocalPrimitiveFields(
		context,
		EntityType.BlockheadActionOutcome_Timestamp,
		observationEntitySelector,
		observationPrimitiveFields
	)
	await Promise.all([
		replaceLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadActionOutcome,
			entitySelector,
			'$sessionAction',
			[sessionActionEntitySelector]
		),
		replaceLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadActionOutcome,
			entitySelector,
			'$walletRequest',
			outcome.walletRequest === undefined ? [] : [outcome.walletRequest]
		),
		replaceLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadActionOutcome,
			entitySelector,
			'$intentOrder',
			outcome.intentOrder === undefined ? [] : [outcome.intentOrder]
		),
		replaceLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadActionOutcome,
			entitySelector,
			'$simulation',
			outcome.simulation === undefined ? [] : [outcome.simulation]
		),
		replaceLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadActionOutcome,
			entitySelector,
			'$$evmTransactions',
			outcome.evmTransactions ?? []
		),
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadActionOutcome,
			entitySelector,
			'$$timestamps',
			observationEntitySelector
		),
		replaceLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadActionOutcome_Timestamp,
			observationEntitySelector,
			'$outcome',
			[entitySelector]
		),
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadSessionAction,
			sessionActionEntitySelector,
			'$$outcomes',
			entitySelector
		),
	])
	await Promise.all([
		context.entityCollections[EntityType.BlockheadActionOutcome].utils.waitForPersistence(),
		context.entityCollections[EntityType.BlockheadActionOutcome_Timestamp].utils.waitForPersistence(),
		...[
			'$sessionAction',
			'$walletRequest',
			'$intentOrder',
			'$simulation',
			'$$evmTransactions',
			'$$timestamps',
			...Object.keys(primitiveFields),
		].map((fieldName) => context.entityFieldCollections[EntityType.BlockheadActionOutcome][
			entityFieldAddressKey(EntityType.BlockheadActionOutcome, [], fieldName)
		].utils.waitForPersistence()),
		...[
			'$outcome',
			...Object.keys(observationPrimitiveFields),
		].map((fieldName) => context.entityFieldCollections[EntityType.BlockheadActionOutcome_Timestamp][
			entityFieldAddressKey(EntityType.BlockheadActionOutcome_Timestamp, [], fieldName)
		].utils.waitForPersistence()),
		context.entityFieldCollections[EntityType.BlockheadSessionAction][
			entityFieldAddressKey(EntityType.BlockheadSessionAction, [], '$$outcomes')
		].utils.waitForPersistence(),
		...[
			[
				EntityType.BlockheadActionOutcome,
				'$$evmTransactions',
			],
			[
				EntityType.BlockheadActionOutcome,
				'$$timestamps',
			],
			[
				EntityType.BlockheadSessionAction,
				'$$outcomes',
			],
		].flatMap(([entityType, fieldName]) => {
			const collection = context.entityFieldCountCollections[entityType][
				entityFieldAddressKey(entityType, [], fieldName)
			]
			return collection === undefined ? [] : [collection.utils.waitForPersistence()]
		}),
	])

	return {
		entitySelector,
		observationEntitySelector,
	}
}

export const writeLocalBlockheadActionReadinessChecks = async (
	context: LocalMutationContext,
	sessionActionEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadSessionAction>,
	readinessChecks: readonly {
		check: LocalBlockheadActionReadinessCheck
		observation: LocalBlockheadActionReadinessCheck_Timestamp
	}[]
) => {
	const checkEntitySelectors = readinessChecks.map(({ check }) => ({
		sessionId: sessionActionEntitySelector.sessionId,
		actionId: sessionActionEntitySelector.actionId,
		checkId: check.checkId,
	}))
	const relationshipApplications = [
		replaceLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadSessionAction,
			sessionActionEntitySelector,
			'$$readinessChecks',
			checkEntitySelectors
		),
	]
	readinessChecks.forEach(({ check, observation }, index) => {
		const checkEntitySelector = checkEntitySelectors[index]
		const observationEntitySelector = {
			$readinessCheck: checkEntitySelector,
			timestampMs: observation.timestampMs,
			source: observation.source,
		}
		writeLocalPresence(
			context,
			EntityType.BlockheadActionReadinessCheck,
			checkEntitySelector
		)
		writeLocalPrimitiveFields(
			context,
			EntityType.BlockheadActionReadinessCheck,
			checkEntitySelector,
			{
				sessionId: sessionActionEntitySelector.sessionId,
				actionId: sessionActionEntitySelector.actionId,
				checkId: check.checkId,
				checkKind: check.checkKind,
				networkCaip2: check.networkCaip2,
				accountCaip10: check.accountCaip10,
				assetCaip19: check.assetCaip19,
				chainId: check.chainId,
				accountAddress: check.accountAddress,
				tokenAddress: check.tokenAddress,
				spenderAddress: check.spenderAddress,
				capabilityKey: check.capabilityKey,
				requiredAmount: check.requiredAmount,
				createdAt: check.createdAt,
			}
		)
		writeLocalPresence(
			context,
			EntityType.BlockheadActionReadinessCheck_Timestamp,
			observationEntitySelector
		)
		writeLocalPrimitiveFields(
			context,
			EntityType.BlockheadActionReadinessCheck_Timestamp,
			observationEntitySelector,
			{
				timestampMs: observation.timestampMs,
				source: observation.source,
				status: observation.status,
				observedAmount: observation.observedAmount,
				requiredAmount: observation.requiredAmount,
				deficitAmount: observation.deficitAmount,
				observedCapabilityStatus: observation.observedCapabilityStatus,
				sourcePayloadHash: observation.sourcePayloadHash,
				error: observation.error,
			}
		)
		relationshipApplications.push(
			replaceLocalEntityReferenceFieldRows(
				context,
				EntityType.BlockheadActionReadinessCheck,
				checkEntitySelector,
				'$sessionAction',
				[sessionActionEntitySelector]
			),
			writeLocalEntityReferenceField(
				context,
				EntityType.BlockheadActionReadinessCheck,
				checkEntitySelector,
				'$$timestamps',
				observationEntitySelector
			),
			replaceLocalEntityReferenceFieldRows(
				context,
				EntityType.BlockheadActionReadinessCheck_Timestamp,
				observationEntitySelector,
				'$readinessCheck',
				[checkEntitySelector]
			)
		)
	})
	await Promise.all(relationshipApplications)
	await Promise.all([
		context.entityCollections[EntityType.BlockheadActionReadinessCheck].utils.waitForPersistence(),
		context.entityCollections[EntityType.BlockheadActionReadinessCheck_Timestamp].utils.waitForPersistence(),
		...[
			'$sessionAction',
			'sessionId',
			'actionId',
			'checkId',
			'checkKind',
			'networkCaip2',
			'accountCaip10',
			'assetCaip19',
			'chainId',
			'accountAddress',
			'tokenAddress',
			'spenderAddress',
			'capabilityKey',
			'requiredAmount',
			'createdAt',
			'$$timestamps',
		].map((fieldName) => context.entityFieldCollections[EntityType.BlockheadActionReadinessCheck][
			entityFieldAddressKey(EntityType.BlockheadActionReadinessCheck, [], fieldName)
		].utils.waitForPersistence()),
		...[
			'$readinessCheck',
			'timestampMs',
			'source',
			'status',
			'observedAmount',
			'requiredAmount',
			'deficitAmount',
			'observedCapabilityStatus',
			'sourcePayloadHash',
			'error',
		].map((fieldName) => context.entityFieldCollections[EntityType.BlockheadActionReadinessCheck_Timestamp][
			entityFieldAddressKey(EntityType.BlockheadActionReadinessCheck_Timestamp, [], fieldName)
		].utils.waitForPersistence()),
		context.entityFieldCollections[EntityType.BlockheadSessionAction][
			entityFieldAddressKey(EntityType.BlockheadSessionAction, [], '$$readinessChecks')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType.BlockheadSessionAction][
			entityFieldAddressKey(EntityType.BlockheadSessionAction, [], '$$readinessChecks')
		]?.utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType.BlockheadActionReadinessCheck][
			entityFieldAddressKey(EntityType.BlockheadActionReadinessCheck, [], '$$timestamps')
		]?.utils.waitForPersistence(),
	])

	return checkEntitySelectors
}

export const writeLocalBlockheadSessionSimulation = async (
	context: LocalMutationContext,
	sessionEntitySelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
	simulation: LocalBlockheadSessionSimulation,
	simulationCall?: LocalBlockheadSessionSimulationCall
) => {
	const entitySelector = {
		id: simulation.id,
	}
	const primitiveFields = {
		id: simulation.id,
		status: simulation.status,
		createdAt: simulation.createdAt,
		completedAt: simulation.completedAt,
		paramsHash: simulation.paramsHash,
		forkBlockNumber: simulation.forkBlockNumber,
		forkRpcOrigin: simulation.forkRpcOrigin,
		actionCount: simulation.actionCount,
		gasUsed: simulation.gasUsed,
		resultPayloadHash: simulation.resultPayloadHash,
		error: simulation.error,
	}
	writeLocalPresence(context, EntityType.BlockheadSessionSimulation, entitySelector)
	writeLocalPrimitiveFields(
		context,
		EntityType.BlockheadSessionSimulation,
		entitySelector,
		primitiveFields
	)
	const relationshipApplications = [
		replaceLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadSessionSimulation,
			entitySelector,
			'$session',
			[sessionEntitySelector]
		),
		replaceLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadSessionSimulation,
			entitySelector,
			'$$calls',
			simulationCall === undefined ? [] : [{
				simulationId: simulation.id,
				callPath: simulationCall.callPath,
			}]
		),
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadSession,
			sessionEntitySelector,
			'$$simulations',
			entitySelector
		),
		replaceLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadSession,
			sessionEntitySelector,
			'$latestSimulation',
			[entitySelector]
		),
	]
	if (simulationCall !== undefined) {
		const simulationCallEntitySelector = {
			simulationId: simulation.id,
			callPath: simulationCall.callPath,
		}
		writeLocalPresence(
			context,
			EntityType.BlockheadSessionSimulationCall,
			simulationCallEntitySelector
		)
		writeLocalPrimitiveFields(
			context,
			EntityType.BlockheadSessionSimulationCall,
			simulationCallEntitySelector,
			{
				simulationId: simulation.id,
				callPath: simulationCall.callPath,
				parentCallPath: simulationCall.parentCallPath,
				depth: simulationCall.depth,
				callIndex: simulationCall.callIndex,
				callType: simulationCall.callType,
				fromAddress: simulationCall.fromAddress,
				toAddress: simulationCall.toAddress,
				value: simulationCall.value,
				inputSelector: simulationCall.inputSelector,
				inputDataHash: simulationCall.inputDataHash,
				outputDataHash: simulationCall.outputDataHash,
				gasUsed: simulationCall.gasUsed,
				reverted: simulationCall.reverted,
				error: simulationCall.error,
			}
		)
		relationshipApplications.push(replaceLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadSessionSimulationCall,
			simulationCallEntitySelector,
			'$simulation',
			[entitySelector]
		))
	}
	await Promise.all(relationshipApplications)
	writeLocalPrimitiveFields(context, EntityType.BlockheadSession, sessionEntitySelector, {
		simulationCount: new Set(context.entityFieldCollections[EntityType.BlockheadSession][
			entityFieldAddressKey(EntityType.BlockheadSession, [], '$$simulations')
		].toArray.filter((row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
			&& row[EntityMetaKey.ParentSelectorKey] === entitySelectorKey(
				schema,
				entityDefinitionByType[EntityType.BlockheadSession],
				sessionEntitySelector
			)
		)).map((row) => row.valueKey)).size,
	})
	await Promise.all([
		context.entityCollections[EntityType.BlockheadSessionSimulation].utils.waitForPersistence(),
		...(simulationCall === undefined ? [] : [
			context.entityCollections[EntityType.BlockheadSessionSimulationCall].utils.waitForPersistence(),
		]),
		...[
			'$session',
			...Object.keys(primitiveFields),
			'$$calls',
		].map((fieldName) => context.entityFieldCollections[EntityType.BlockheadSessionSimulation][
			entityFieldAddressKey(EntityType.BlockheadSessionSimulation, [], fieldName)
		].utils.waitForPersistence()),
		...(simulationCall === undefined ? [] : [
			'$simulation',
			'simulationId',
			'callPath',
			'parentCallPath',
			'depth',
			'callIndex',
			'callType',
			'fromAddress',
			'toAddress',
			'value',
			'inputSelector',
			'inputDataHash',
			'outputDataHash',
			'gasUsed',
			'reverted',
			'error',
		].map((fieldName) => context.entityFieldCollections[EntityType.BlockheadSessionSimulationCall][
			entityFieldAddressKey(EntityType.BlockheadSessionSimulationCall, [], fieldName)
		].utils.waitForPersistence())),
		...[
			'$latestSimulation',
			'simulationCount',
			'$$simulations',
		].map((fieldName) => context.entityFieldCollections[EntityType.BlockheadSession][
			entityFieldAddressKey(EntityType.BlockheadSession, [], fieldName)
		].utils.waitForPersistence()),
		context.entityFieldCountCollections[EntityType.BlockheadSessionSimulation][
			entityFieldAddressKey(EntityType.BlockheadSessionSimulation, [], '$$calls')
		]?.utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType.BlockheadSession][
			entityFieldAddressKey(EntityType.BlockheadSession, [], '$$simulations')
		]?.utils.waitForPersistence(),
	])

	return entitySelector
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
	deleteLocalEntityFields(context, EntityType.BlockheadPanel, panelSelector)
	deleteLocalPresence(context, EntityType.BlockheadPanel, panelSelector)
}

export const writeLocalBlockheadWallet = async (
	context: LocalMutationContext,
	candidate: LocalWalletCandidate
) => {
	const connectionMethod = walletConnectionMethodByProtocolDiscoveryKindTransportKind[[
		candidate.protocol,
		candidate.discoveryKind,
		candidate.transportKind,
	].join(':')]
	if (connectionMethod == null)
		throw new Error(`Wallet candidate ${candidate.id} has no connection method`)

	const entitySelector = {
		id: candidate.id,
	}
	const parentEntitySelector = {
		scope: '$$blockheadWallets',
	}
	writeLocalPresence(context, EntityType.BlockheadWallet, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadWallet, entitySelector, {
		name: candidate.name,
		icon: candidate.icon,
		protocol: candidate.protocol,
		discoveryKind: candidate.discoveryKind,
		transportKind: candidate.transportKind,
		rdns: candidate.rdns,
		capabilities: candidate.capabilities,
	})
	const relationshipApplications = [
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadWallet,
			entitySelector,
			'$connectionMethod',
			{
				id: connectionMethod.id,
			}
		),
		writeLocalEntityReferenceField(
			context,
			EntityType._Global,
			parentEntitySelector,
			'$$blockheadWallets',
			entitySelector
		),
	]
	await Promise.all([
		...relationshipApplications,
		context.entityCollections[EntityType.BlockheadWallet].utils.waitForPersistence(),
		...[
			'name',
			'icon',
			'protocol',
			'discoveryKind',
			'transportKind',
			'rdns',
			'capabilities',
			'$connectionMethod',
		].map((fieldName) => (
			context.entityFieldCollections[EntityType.BlockheadWallet][
				entityFieldAddressKey(EntityType.BlockheadWallet, [], fieldName)
			].utils.waitForPersistence()
		)),
		context.entityFieldCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadWallets')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadWallets')
		]?.utils.waitForPersistence(),
	])
}

const blockheadAccountSelector = (
	account: Pick<
		LocalWalletAccount,
		'namespace' | 'reference' | 'accountAddress'
	>
) => ({
	$account: {
		caip10: {
			namespace: account.namespace,
			reference: account.reference,
			accountAddress: account.accountAddress,
		},
	},
})

export const writeLocalBlockheadAccount = async (
	context: LocalMutationContext,
	account: Pick<
		LocalWalletAccount,
		'namespace' | 'reference' | 'accountAddress'
	>
) => {
	const entitySelector = blockheadAccountSelector(account)
	const parentEntitySelector = {
		scope: '$$blockheadAccounts',
	}
	writeLocalPresence(context, EntityType.BlockheadAccount, entitySelector)
	const relationshipApplications = [
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadAccount,
			entitySelector,
			'$account',
			entitySelector.$account
		),
		writeLocalEntityReferenceField(
			context,
			EntityType._Global,
			parentEntitySelector,
			'$$blockheadAccounts',
			entitySelector
		),
	]
	await Promise.all([
		...relationshipApplications,
		context.entityCollections[EntityType.BlockheadAccount].utils.waitForPersistence(),
		context.entityFieldCollections[EntityType.BlockheadAccount][
			entityFieldAddressKey(EntityType.BlockheadAccount, [], '$account')
		].utils.waitForPersistence(),
		context.entityFieldCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadAccounts')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadAccounts')
		]?.utils.waitForPersistence(),
	])
}

export const deleteLocalBlockheadAccount = async (
	context: LocalMutationContext,
	account: Pick<
		LocalWalletAccount,
		'namespace' | 'reference' | 'accountAddress'
	>
) => {
	const entitySelector = blockheadAccountSelector(account)
	const parentEntitySelector = {
		scope: '$$blockheadAccounts',
	}
	const relationshipApplication = deleteLocalEntityReferenceField(
		context,
		EntityType._Global,
		parentEntitySelector,
		'$$blockheadAccounts',
		entitySelector
	)
	deleteLocalEntityFields(context, EntityType.BlockheadAccount, entitySelector)
	deleteLocalPresence(context, EntityType.BlockheadAccount, entitySelector)
	await Promise.all([
		relationshipApplication,
		context.entityFieldCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadAccounts')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadAccounts')
		]?.utils.waitForPersistence(),
		context.entityCollections[EntityType.BlockheadAccount].utils.waitForPersistence(),
		...Object.values(context.entityFieldCollections[EntityType.BlockheadAccount])
			.map((collection) => collection.utils.waitForPersistence()),
		...Object.values(context.entityFieldCountCollections[EntityType.BlockheadAccount])
			.flatMap((collection) => (
				collection === undefined ? [] : [collection.utils.waitForPersistence()]
			)),
	])
}

export const writeLocalBlockheadWalletConnection = async (
	context: LocalMutationContext,
	connection: PersistedWalletConnection | WalletConnection
) => {
	const persisted = walletConnectionPersistRoundTrip(connection)
	const activeAccount = persisted.activeAccount ?? persisted.accounts.at(0)
	const connectionKey = persisted.connectionKey
	const entitySelector = {
		connectionKey,
	}

	writeLocalPresence(context, EntityType.BlockheadWalletConnection, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadWalletConnection, entitySelector, {
		connectionKey,
		status: persisted.status,
		protocol: persisted.protocol,
		transportKind: persisted.transportKind,
		scopes: persisted.scopes,
	})
	const relationshipApplications = [
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadWalletConnection,
			entitySelector,
			'$wallet',
			{
				id: persisted.walletId,
			}
		),
		replaceLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadWalletConnection,
			entitySelector,
			'$$accounts',
			persisted.accounts.map((account) => ({
				caip10: {
					namespace: account.namespace,
					reference: account.reference,
					accountAddress: account.accountAddress,
				},
			}))
		),
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
		),
	]
	// Always write optional lifecycle fields (undefined clears stale error/selected timestamps).
	writeLocalPrimitiveFields(context, EntityType.BlockheadWalletConnection, entitySelector, {
		selected: 'selected' in persisted ? persisted.selected : undefined,
		connectedAt: 'connectedAt' in persisted ? persisted.connectedAt : undefined,
		disconnectedAt: 'disconnectedAt' in persisted ? persisted.disconnectedAt : undefined,
		sessionId: persisted.sessionId,
		sessionTopic: persisted.sessionTopic,
		error: 'error' in persisted ? persisted.error : undefined,
	})
	relationshipApplications.push(writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$blockheadWalletConnections' },
		'$$blockheadWalletConnections',
		entitySelector
	))
	await Promise.all([
		...relationshipApplications,
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
			'connectedAt',
			'disconnectedAt',
			'sessionId',
			'sessionTopic',
			'error',
		].map((fieldName) => (
			context.entityFieldCollections[EntityType.BlockheadWalletConnection][
				entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], fieldName)
			].utils.waitForPersistence()
		)),
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
	const relationshipApplication = replaceLocalEntityReferenceFieldRows(
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
	await Promise.all([
		relationshipApplication,
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
	connection: FarcasterAccountConnection | PersistedFarcasterAccountConnection
) => {
	const machine = (
		'role' in connection ?
			connection
		:
			farcasterAccountConnectionFromPersisted(connection)
	)
	if (machine == null)
		throw new Error(`Farcaster account connection expired or illegal: ${connection.connectionId}`)

	const persisted = persistFarcasterAccountConnection(machine)
	const entitySelector = {
		connectionId: persisted.connectionId,
	}
	writeLocalPresence(context, EntityType.BlockheadFarcasterAccountConnection, entitySelector)
	writeLocalEntityReferenceField(
		context,
		EntityType.BlockheadFarcasterAccountConnection,
		entitySelector,
		'$user',
		{
			fid: persisted.fid,
		}
	)
	writeLocalPrimitiveFields(context, EntityType.BlockheadFarcasterAccountConnection, entitySelector, {
		connectionId: persisted.connectionId,
		signerAddress: persisted.signerAddress,
		authMethod: persisted.authMethod,
		verifiedAt: persisted.verifiedAt,
		expiresAt: persisted.expiresAt,
		associationFingerprint: persisted.associationFingerprint,
		selected: persisted.selected,
	})
	writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$blockheadFarcasterAccountConnections' },
		'$$blockheadFarcasterAccountConnections',
		entitySelector
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

export const writeLocalBlockheadEvmWalletRequest = async (
	context: LocalMutationContext,
	walletRequestSelector: EntitySelector<typeof schema, EntityType.BlockheadWalletRequest>,
	detail: LocalBlockheadEvmWalletRequest
) => {
	const entitySelector = {
		$walletRequest: walletRequestSelector,
	}
	if (context.entityCollections[EntityType.BlockheadEvmWalletRequest].toArray.some((row) => (
		row[EntityMetaKey.Source] === Source.Local_Internal
		&& row[EntityMetaKey.SelectorKey] === entitySelectorKey(
			schema,
			entityDefinitionByType[EntityType.BlockheadEvmWalletRequest],
			entitySelector
		)
	)))
		throw new Error(`EVM wallet request detail already exists: ${walletRequestSelector.id}`)

	writeLocalPresence(context, EntityType.BlockheadEvmWalletRequest, entitySelector)
	await Promise.all([
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadEvmWalletRequest,
			entitySelector,
			'$walletRequest',
			walletRequestSelector
		),
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadWalletRequest,
			walletRequestSelector,
			'$evmRequest',
			entitySelector
		),
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadEvmWalletRequest,
			entitySelector,
			'$network',
			detail.network
		),
		(
			detail.simulation === undefined ?
				deleteLocalEntityReferenceFieldRows(
					context,
					EntityType.BlockheadEvmWalletRequest,
					entitySelector,
					'$simulation'
				)
			:
				writeLocalEntityReferenceField(
					context,
					EntityType.BlockheadEvmWalletRequest,
					entitySelector,
					'$simulation',
					detail.simulation
				)
		),
	])
	await deleteLocalEntityReferenceFieldRows(
		context,
		EntityType.BlockheadEvmWalletRequest,
		entitySelector,
		'$$calls'
	)
	await Promise.all(detail.calls.map(async (call, callIndex) => {
		const callSelector = {
			$evmRequest: entitySelector,
			callIndex,
		}
		writeLocalPresence(context, EntityType.BlockheadWalletRequestCall, callSelector)
		writeLocalPrimitiveFields(context, EntityType.BlockheadWalletRequestCall, callSelector, {
			callIndex,
			toAddress: call.toAddress,
			value: call.value,
			inputDataHash: call.inputDataHash,
		})
		await Promise.all([
			writeLocalEntityReferenceField(
				context,
				EntityType.BlockheadWalletRequestCall,
				callSelector,
				'$evmRequest',
				entitySelector
			),
			writeLocalEntityReferenceField(
				context,
				EntityType.BlockheadEvmWalletRequest,
				entitySelector,
				'$$calls',
				callSelector,
				callIndex
			),
		])
		await Promise.all([
			context.entityCollections[EntityType.BlockheadWalletRequestCall].utils.waitForPersistence(),
			...[
				'$evmRequest',
				'callIndex',
				'toAddress',
				'value',
				'inputDataHash',
			].map((fieldName) => context.entityFieldCollections[EntityType.BlockheadWalletRequestCall][
				entityFieldAddressKey(EntityType.BlockheadWalletRequestCall, [], fieldName)
			].utils.waitForPersistence()),
		])
	}))
	await Promise.all([
		context.entityCollections[EntityType.BlockheadEvmWalletRequest].utils.waitForPersistence(),
		...[
			'$walletRequest',
			'$network',
			'$simulation',
			'$$calls',
		].map((fieldName) => context.entityFieldCollections[EntityType.BlockheadEvmWalletRequest][
			entityFieldAddressKey(EntityType.BlockheadEvmWalletRequest, [], fieldName)
		].utils.waitForPersistence()),
		context.entityFieldCountCollections[EntityType.BlockheadEvmWalletRequest][
			entityFieldAddressKey(EntityType.BlockheadEvmWalletRequest, [], '$$calls')
		]?.utils.waitForPersistence(),
		context.entityFieldCollections[EntityType.BlockheadWalletRequest][
			entityFieldAddressKey(EntityType.BlockheadWalletRequest, [], '$evmRequest')
		].utils.waitForPersistence(),
	])
}

export const writeLocalBlockheadWalletRequest_Timestamp = async (
	context: LocalMutationContext,
	walletRequestSelector: EntitySelector<typeof schema, EntityType.BlockheadWalletRequest>,
	observation: LocalBlockheadWalletRequest_TimestampInput
) => {
	const entitySelector = {
		$walletRequest: walletRequestSelector,
		timestampMs: observation.timestampMs,
		source: observation.source,
	}
	if (context.entityCollections[EntityType.BlockheadWalletRequest_Timestamp].toArray.some((row) => (
		row[EntityMetaKey.Source] === Source.Local_Internal
		&& row[EntityMetaKey.SelectorKey] === entitySelectorKey(
			schema,
			entityDefinitionByType[EntityType.BlockheadWalletRequest_Timestamp],
			entitySelector
		)
	))) {
		await context.entityCollections[EntityType.BlockheadWalletRequest_Timestamp].utils.waitForPersistence()
		return
	}

	writeLocalPresence(context, EntityType.BlockheadWalletRequest_Timestamp, entitySelector)
	writeLocalPrimitiveFields(context, EntityType.BlockheadWalletRequest_Timestamp, entitySelector, {
		timestampMs: observation.timestampMs,
		source: observation.source,
		status: observation.status,
		walletStatusCode: observation.walletStatusCode,
		atomic: observation.atomic,
		transactionId: observation.transactionId,
		signatureHash: observation.signatureHash,
		statusPayloadHash: observation.statusPayloadHash,
		error: observation.error,
	})
	await Promise.all([
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadWalletRequest_Timestamp,
			entitySelector,
			'$walletRequest',
			walletRequestSelector
		),
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadWalletRequest,
			walletRequestSelector,
			'$$timestamps',
			entitySelector
		),
	])
	if (observation.evmTransactions !== undefined) {
		await deleteLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadWalletRequest_Timestamp,
			entitySelector,
			'$$evmTransactions'
		)
		await Promise.all(observation.evmTransactions.map((transactionSelector, valueIndex) => (
			writeLocalEntityReferenceField(
				context,
				EntityType.BlockheadWalletRequest_Timestamp,
				entitySelector,
				'$$evmTransactions',
				transactionSelector,
				valueIndex
			)
		)))
	}
	await Promise.all([
		context.entityCollections[EntityType.BlockheadWalletRequest_Timestamp].utils.waitForPersistence(),
		...[
			'$walletRequest',
			'timestampMs',
			'source',
			'status',
			'walletStatusCode',
			'atomic',
			'transactionId',
			'signatureHash',
			'statusPayloadHash',
			'error',
		].map((fieldName) => context.entityFieldCollections[EntityType.BlockheadWalletRequest_Timestamp][
			entityFieldAddressKey(EntityType.BlockheadWalletRequest_Timestamp, [], fieldName)
		].utils.waitForPersistence()),
		context.entityFieldCollections[EntityType.BlockheadWalletRequest][
			entityFieldAddressKey(EntityType.BlockheadWalletRequest, [], '$$timestamps')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType.BlockheadWalletRequest][
			entityFieldAddressKey(EntityType.BlockheadWalletRequest, [], '$$timestamps')
		]?.utils.waitForPersistence(),
		...(
			observation.evmTransactions === undefined ?
				[]
			:
				[
					context.entityFieldCollections[EntityType.BlockheadWalletRequest_Timestamp][
						entityFieldAddressKey(EntityType.BlockheadWalletRequest_Timestamp, [], '$$evmTransactions')
					].utils.waitForPersistence(),
					context.entityFieldCountCollections[EntityType.BlockheadWalletRequest_Timestamp][
						entityFieldAddressKey(EntityType.BlockheadWalletRequest_Timestamp, [], '$$evmTransactions')
					]?.utils.waitForPersistence(),
				]
		),
	])
}

export const writeLocalBlockheadWalletRequestSubmittedAt = async (
	context: LocalMutationContext,
	walletRequestSelector: EntitySelector<typeof schema, EntityType.BlockheadWalletRequest>,
	submittedAt: NonNullable<
		EntityFieldValues<typeof schema, EntityType.BlockheadWalletRequest>['submittedAt']
	>
) => {
	writeLocalPrimitiveFields(context, EntityType.BlockheadWalletRequest, walletRequestSelector, {
		submittedAt,
	})
	await context.entityFieldCollections[EntityType.BlockheadWalletRequest][
		entityFieldAddressKey(EntityType.BlockheadWalletRequest, [], 'submittedAt')
	].utils.waitForPersistence()
}

export const writeLocalBlockheadWalletRequest = async (
	context: LocalMutationContext,
	request: LocalBlockheadWalletRequest,
	connections: readonly WalletConnection[]
) => {
	const selection = resolveWalletPrepSelection(connections)
	if (!selection.ready)
		throw new Error(selection.error)
	if (request.walletConnection.connectionKey !== selection.connectionKey)
		throw new Error('Wallet request connection does not match the selected wallet connection')
	if (
		request.account != null
		&& (
			!('caip10' in request.account)
			|| request.account.caip10.namespace !== selection.account.namespace
			|| request.account.caip10.reference !== selection.account.reference
			|| request.account.caip10.accountAddress.toLowerCase() !== selection.account.accountAddress.toLowerCase()
		)
	)
		throw new Error('Wallet request account does not match the selected wallet account')

	const entitySelector = {
		id: request.id,
	}
	if (context.entityCollections[EntityType.BlockheadWalletRequest].toArray.some((row) => (
		row[EntityMetaKey.Source] === Source.Local_Internal
		&& row[EntityMetaKey.SelectorKey] === entitySelectorKey(
			schema,
			entityDefinitionByType[EntityType.BlockheadWalletRequest],
			entitySelector
		)
	)))
		throw new Error(`Wallet request definition already exists: ${request.id}`)

	writeLocalPresence(context, EntityType.BlockheadWalletRequest, entitySelector)
	const relationshipApplications = [
		writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadWalletRequest,
			entitySelector,
			'$walletConnection',
			request.walletConnection
		),
	]
	if (request.sessionAction === undefined)
		relationshipApplications.push(deleteLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadWalletRequest,
			entitySelector,
			'$sessionAction'
		))
	else {
		relationshipApplications.push(writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadWalletRequest,
			entitySelector,
			'$sessionAction',
			request.sessionAction
		))
		relationshipApplications.push(writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadSessionAction,
			request.sessionAction,
			'$$walletRequests',
			entitySelector
		))
	}
	if (request.intentOrder === undefined)
		relationshipApplications.push(deleteLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadWalletRequest,
			entitySelector,
			'$intentOrder'
		))
	else
		relationshipApplications.push(writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadWalletRequest,
			entitySelector,
			'$intentOrder',
			request.intentOrder
		))
	if (request.account === undefined)
		relationshipApplications.push(deleteLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadWalletRequest,
			entitySelector,
			'$account'
		))
	else
		relationshipApplications.push(writeLocalEntityReferenceField(
			context,
			EntityType.BlockheadWalletRequest,
			entitySelector,
			'$account',
			request.account
		))
	writeLocalPrimitiveFields(context, EntityType.BlockheadWalletRequest, entitySelector, {
		id: request.id,
		requestKind: request.requestKind,
		requestMethod: request.requestMethod,
		atomicRequired: request.atomicRequired,
		requestPayloadHash: request.requestPayloadHash,
		requestedAt: request.requestedAt,
	})
	relationshipApplications.push(writeLocalEntityReferenceField(
		context,
		EntityType._Global,
		{ scope: '$$blockheadWalletRequests' },
		'$$blockheadWalletRequests',
		entitySelector
	))
	await Promise.all(relationshipApplications)
	if (request.evm === undefined)
		await deleteLocalEntityReferenceFieldRows(
			context,
			EntityType.BlockheadWalletRequest,
			entitySelector,
			'$evmRequest'
		)
	else if (request.evm.calls.length === 0)
		throw new Error('Wallet request preparation requires at least one BlockheadWalletRequestCall.')
	else
		await writeLocalBlockheadEvmWalletRequest(context, entitySelector, request.evm)
	await Promise.all([
		context.entityCollections[EntityType.BlockheadWalletRequest].utils.waitForPersistence(),
		...[
			'$sessionAction',
			'$intentOrder',
			'$walletConnection',
			'$account',
			'$evmRequest',
			'id',
			'requestKind',
			'requestMethod',
			'atomicRequired',
			'requestPayloadHash',
			'requestedAt',
		].map((fieldName) => (
			context.entityFieldCollections[EntityType.BlockheadWalletRequest][
				entityFieldAddressKey(EntityType.BlockheadWalletRequest, [], fieldName)
			].utils.waitForPersistence()
		)),
		...(
			request.sessionAction === undefined ? [] : [
				context.entityFieldCollections[EntityType.BlockheadSessionAction][
					entityFieldAddressKey(EntityType.BlockheadSessionAction, [], '$$walletRequests')
				].utils.waitForPersistence(),
				context.entityFieldCountCollections[EntityType.BlockheadSessionAction][
					entityFieldAddressKey(EntityType.BlockheadSessionAction, [], '$$walletRequests')
				]?.utils.waitForPersistence(),
			]
		),
		context.entityFieldCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletRequests')
		].utils.waitForPersistence(),
		context.entityFieldCountCollections[EntityType._Global][
			entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletRequests')
		]?.utils.waitForPersistence(),
	])
}
