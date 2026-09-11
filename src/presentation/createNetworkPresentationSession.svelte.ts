import { stringify } from 'devalue'

import type { ClientContext } from '$/client/$client.svelte.ts'
import { errorDisplayMessage, normalizeBoundaryError } from '$/lib/errors.ts'
import {
	EntityMetaKey,
	entitySelectorKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

import type {
	NetworkBlocksCollectionCell,
	NetworkCollectionCell,
	NetworkDetailDefinition,
	NetworkDetailId,
	NetworkDetailRowFor,
	NetworkEntityPresentationV1,
	NetworkEntityRow,
	NetworkNavigationItem,
	NetworkResourceCellFor,
	NetworkResourceState,
	NetworkSummaryDefinition,
	NetworkSummaryId,
	NetworkTransactionsCollectionCell,
} from './NetworkEntityPresentationV1.ts'
import type {
	NetworkPresentationAction,
	NetworkPresentationCheckpoint,
	NetworkPresentationSession,
} from './NetworkPresentationSession.ts'

type NetworkSelector = EntitySelector<typeof schema, EntityType.Network>
type AppClient = ClientContext<typeof schema, Source>

type Resource<Data> = Readonly<{
	current: Data | undefined
	loading: boolean
	ready: boolean
	error: object | string | undefined
}>

type SessionOptions = Readonly<{
	client: AppClient
	selector: NetworkSelector
	route: string
	navigation: readonly NetworkNavigationItem[]
	mountId: string
	subscriptionGeneration: number
	persistenceGeneration: number
	initialRevision: number
	checkpoint?: NetworkPresentationCheckpoint
	saveCheckpoint?(checkpoint: NetworkPresentationCheckpoint): void | Promise<void>
	navigate(target: string, returnFocusKey?: string): void | Promise<void>
	back(): string | Promise<string>
	focusMain(): void | Promise<void>
}>

export type NetworkPresentationMaterializedCell = Readonly<{
	state: NetworkResourceState
	value: string | null
	target: string | null
	error: string | null
}>

export type NetworkPresentationMaterializedCollection = ReturnType<typeof materializeCollection>

export type NetworkPresentationDriverSnapshot = Readonly<{
	title: string
	details: Readonly<{
		name: string
		namespace: string
		ledgerModels: string
		executionModels: string
		networkStack: string
		environment: string
	}>
	summary: Readonly<{
		upgrade: NetworkPresentationMaterializedCell
		block: NetworkPresentationMaterializedCell
		feeMarket: NetworkPresentationMaterializedCell
		nativePrice: NetworkPresentationMaterializedCell
		mempool: NetworkPresentationMaterializedCell
		epoch: NetworkPresentationMaterializedCell
		slot: NetworkPresentationMaterializedCell
	}>
	blocks: NetworkPresentationMaterializedCollection
	transactions: NetworkPresentationMaterializedCollection
}>

export type NetworkPresentationDriver = Readonly<{
	selectorKey: string
	selector: Readonly<{ caip2: Readonly<{ namespace: string, reference: string }> }>
	read(): NetworkPresentationDriverSnapshot
	watch(invalidate: () => void): () => void
	retry(cellId: string): void
}>

const decimal = new Intl.NumberFormat('en-US', { maximumFractionDigits: 9 })

const formatFixedBigInt = (value: bigint, decimalPlaces: number) => {
	const divisor = 10n ** BigInt(decimalPlaces)
	const absolute = value < 0n ? -value : value
	const whole = absolute / divisor
	const fraction = String(absolute % divisor).padStart(decimalPlaces, '0').replace(/0+$/, '')
	const sign = value < 0n ? '-' : ''
	return `${sign}${decimal.format(whole)}${fraction === '' ? '' : `.${fraction}`}`
}

export const freezePresentation = (
	presentation: NetworkEntityPresentationV1
): NetworkEntityPresentationV1 => Object.freeze({
	...presentation,
	chrome: Object.freeze({
		...presentation.chrome,
		navigation: Object.freeze(presentation.chrome.navigation.map((item) => Object.freeze({ ...item }))),
	}),
	entity: Object.freeze({
		...presentation.entity,
		selector: Object.freeze({
			caip2: Object.freeze({ ...presentation.entity.selector.caip2 }),
		}),
	}),
	summary: Object.freeze(presentation.summary.map((cell) => Object.freeze({
		...cell,
		sources: Object.freeze([...cell.sources]),
	}))),
	details: Object.freeze(presentation.details.map((row) => Object.freeze({ ...row }))),
	execution: Object.freeze({
		...presentation.execution,
		sections: Object.freeze({
			blocks: Object.freeze({
				...presentation.execution.sections.blocks,
				sources: Object.freeze([...presentation.execution.sections.blocks.sources]),
				rows: Object.freeze(presentation.execution.sections.blocks.rows.map((row) => Object.freeze({ ...row }))),
			}),
			transactions: Object.freeze({
				...presentation.execution.sections.transactions,
				sources: Object.freeze([...presentation.execution.sections.transactions.sources]),
				rows: Object.freeze(presentation.execution.sections.transactions.rows.map((row) => Object.freeze({ ...row }))),
			}),
		}),
	}),
	diagnostics: Object.freeze({ ...presentation.diagnostics }),
})

export const materializeResource = <Data>(
	resource: Resource<Data>,
	read: (data: Data | undefined) => Readonly<{ value: string | null, target?: string | null }>
): NetworkPresentationMaterializedCell => {
	if (resource.error !== undefined)
		return {
			state: 'failed',
			value: null,
			target: null,
			error: errorDisplayMessage(normalizeBoundaryError(resource.error)),
		}
	if (resource.loading || !resource.ready)
		return { state: 'pending', value: null, target: null, error: null }

	const materialized = read(resource.current)
	return {
		state: materialized.value === null ? 'resolved-empty' : 'resolved-nonempty',
		value: materialized.value,
		target: materialized.target ?? null,
		error: null,
	}
}

const materializeCollection = <Data>(
	resource: Resource<Data>,
	read: (data: Data | undefined) => readonly NetworkEntityRow[]
) => {
	if (resource.error !== undefined)
		return {
			state: 'failed' as const,
			rows: [] as readonly NetworkEntityRow[],
			error: errorDisplayMessage(normalizeBoundaryError(resource.error)),
		}
	if (resource.loading || !resource.ready)
		return { state: 'pending' as const, rows: [] as readonly NetworkEntityRow[], error: null }

	const rows = read(resource.current)
	return {
		state: rows.length === 0 ? 'resolved-empty' as const : 'resolved-nonempty' as const,
		rows,
		error: null,
	}
}

export const acquireNetworkPresentationDriver = (
	client: AppClient,
	selector: NetworkSelector
): NetworkPresentationDriver => {
	if (!('caip2' in selector))
		throw new Error('NetworkEntityPresentationV1 requires a CAIP-2 selector')
	if (selector.caip2.namespace !== 'eip155' || selector.caip2.reference !== '1')
		throw new Error('NetworkEntityPresentationV1 is frozen to eip155:1')

	const selectorKey = entitySelectorKey(
		client.schema,
		client.entityDefinitionByType[EntityType.Network],
		selector
	)
	const selection = client.select(EntityType.Network, selector)
	const projection = selection.Evm
	const network = selection({
		sources: [Source.Constants_Internal],
		fields: {
			name: true,
			namespace: true,
			ledgerModels: true,
			executionModels: true,
			environment: true,
			caip2: true,
		},
	})
	const networkStack = selection.$networkStack({
		sources: [Source.Constants_Internal],
		fields: { label: true },
	})
	const latestUpgrade = projection.$$upgrades({
		sources: [Source.Constants_Internal],
		fields: { name: true, activationBlock: true },
		limit: 1,
		orderBy: [[({ fieldRow }) => fieldRow[EntityMetaKey.Value].activationBlock ?? Number.NEGATIVE_INFINITY, 'desc']],
	})
	const latestBlock = projection.$$blocks({
		sources: [Source.Voltaire_JsonRpc],
		fields: { blockNumber: true },
		limit: 1,
		orderBy: [[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].blockNumber ?? Number.NEGATIVE_INFINITY, 'desc']],
	})
	const latestFeeMarket = projection.$$gasFeeBlocks({
		sources: [Source.Voltaire_JsonRpc],
		fields: { blockNumber: true, baseFeePerGas: true, gasUsedRatio: true },
		limit: 1,
		orderBy: [[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].blockNumber ?? Number.NEGATIVE_INFINITY, 'desc']],
	})
	const nativePrice = projection.$nativeCoin({
		sources: [Source.Constants_Internal],
		fields: {
			$$marketsWithCoinAsBase: {
				sources: [Source.Constants_Internal],
				limit: 1,
				fields: {
					$$marketPrices: {
						sources: [Source.Constants_Internal],
						limit: 1,
						fields: {
							$$quotes: {
								sources: [Source.Coingecko_Rest],
								fields: { price: true },
								limit: 1,
								orderBy: [[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].timestampMs ?? Number.NEGATIVE_INFINITY, 'desc']],
							},
						},
					},
				},
			},
		},
	})
	const latestMempool = projection.$$txpoolTimestamps({
		sources: [Source.Voltaire_JsonRpc],
		fields: { timestampMs: true, pendingCount: true, queuedCount: true },
		limit: 1,
		orderBy: [[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].timestampMs ?? Number.NEGATIVE_INFINITY, 'desc']],
	})
	const latestEpoch = projection.$$beaconEpochs({
		sources: [Source.Beacon_Rest],
		fields: { epoch: true, startSlot: true, endSlot: true },
		limit: 1,
		orderBy: [[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].epoch ?? Number.NEGATIVE_INFINITY, 'desc']],
	})
	const latestSlot = projection.$$beaconSlots({
		sources: [Source.Beacon_Rest],
		fields: { slot: true, epoch: true },
		limit: 1,
		orderBy: [[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].slot ?? Number.NEGATIVE_INFINITY, 'desc']],
	})
	const blocks = projection.$$blocks({
		sources: [Source.Voltaire_JsonRpc],
		limit: 4,
		fields: { blockNumber: true, hash: true },
	})
	const transactions = projection.$$transactions({
		sources: [Source.Blockscout_Rest],
		limit: 16,
		fields: { txHash: true },
	})
	const resources = [
		network,
		networkStack,
		latestUpgrade,
		latestBlock,
		latestFeeMarket,
		nativePrice,
		latestMempool,
		latestEpoch,
		latestSlot,
		blocks,
		transactions,
	]
	const caip2 = `${selector.caip2.namespace}:${selector.caip2.reference}`

	return {
		selectorKey,
		selector: { caip2: selector.caip2 },
		read() {
			const entity = network.current
			return {
				title: network.ready ? entity?.name || caip2 : caip2,
				details: {
					name: entity?.name ?? '',
					namespace: entity?.namespace ?? '',
					ledgerModels: entity?.ledgerModels?.values.join(', ') ?? '',
					executionModels: entity?.executionModels?.values.join(', ') ?? '',
					networkStack: networkStack.current?.label ?? '',
					environment: entity?.environment ?? '',
				},
				summary: {
					upgrade: materializeResource(latestUpgrade, (data) => ({ value: data?.values[0]?.name || null })),
					block: materializeResource(latestBlock, (data) => {
						const blockNumber = data?.values[0]?.[EntityMetaKey.Selector].blockNumber
						return blockNumber === undefined
							? { value: null }
							: { value: String(blockNumber), target: `/network/${caip2}/block/${blockNumber}` }
					}),
					feeMarket: materializeResource(latestFeeMarket, (data) => {
						const row = data?.values[0]
						if (row === undefined || row.baseFeePerGas == null)
							return { value: null }
						return { value: `${decimal.format(row[EntityMetaKey.Selector].blockNumber)} · ${formatFixedBigInt(row.baseFeePerGas, 9)} gwei` }
					}),
					nativePrice: materializeResource(nativePrice, (data) => {
						const price = data?.$$marketsWithCoinAsBase.values[0]?.$$marketPrices.values[0]?.$$quotes.values[0]?.price
						if (price === undefined)
							return { value: null }
						return { value: formatFixedBigInt(price, 8) }
					}),
					mempool: materializeResource(latestMempool, (data) => {
						const row = data?.values[0]
						return row === undefined
							? { value: null }
							: { value: `${decimal.format(row.pendingCount)} pending · ${decimal.format(row.queuedCount)} queued` }
					}),
					epoch: materializeResource(latestEpoch, (data) => {
						const epoch = data?.values[0]?.[EntityMetaKey.Selector].epoch
						return epoch === undefined
							? { value: null }
							: { value: String(epoch), target: `/network/${caip2}/epoch/${epoch}` }
					}),
					slot: materializeResource(latestSlot, (data) => {
						const slot = data?.values[0]?.[EntityMetaKey.Selector].slot
						return slot === undefined
							? { value: null }
							: { value: String(slot), target: `/network/${caip2}/slot/${slot}` }
					}),
				},
				blocks: materializeCollection(blocks, (data) => (data?.values ?? []).map((row) => {
					const blockNumber = row[EntityMetaKey.Selector].blockNumber
					return {
						key: row[EntityMetaKey.SelectorKey],
						label: String(blockNumber),
						target: `/network/${caip2}/block/${blockNumber}`,
					}
				})),
				transactions: materializeCollection(transactions, (data) => (data?.values ?? []).map((row) => {
					const txHash = row[EntityMetaKey.Selector].txHash
					return {
						key: row[EntityMetaKey.SelectorKey],
						label: txHash,
						target: `/network/${caip2}/tx/${txHash}`,
					}
				})),
			}
		},
		watch(invalidate) {
			return $effect.root(() => {
				$effect(() => {
					for (const resource of resources) {
						resource.current
						resource.loading
						resource.ready
						resource.error
					}
					invalidate()
				})
			})
		},
		retry(cellId) {
			if (cellId === 'native-price') {
				client.retryField(EntityType.Network, ['Evm'], '$nativeCoin')
				client.retryField(EntityType.Coin, [], '$$marketsWithCoinAsBase')
				client.retryField(EntityType.Market, [], '$$marketPrices')
				client.retryField(EntityType.MarketPrice, [], '$$quotes')
				client.retryField(EntityType.Market_Timestamp, [], 'price')
			} else if (cellId === 'upgrade')
				client.retryField(EntityType.Network, ['Evm'], '$$upgrades')
			else if (cellId === 'block' || cellId === 'blocks')
				client.retryField(EntityType.Network, ['Evm'], '$$blocks')
			else if (cellId === 'fee-market')
				client.retryField(EntityType.Network, ['Evm'], '$$gasFeeBlocks')
			else if (cellId === 'mempool')
				client.retryField(EntityType.Network, ['Evm'], '$$txpoolTimestamps')
			else if (cellId === 'epoch')
				client.retryField(EntityType.Network, ['Evm'], '$$beaconEpochs')
			else if (cellId === 'slot')
				client.retryField(EntityType.Network, ['Evm'], '$$beaconSlots')
			else if (cellId === 'transactions')
				client.retryField(EntityType.Network, ['Evm'], '$$transactions')
			else
				throw new Error(`${cellId}: retry is not owned by one Network.Evm field`)
		},
	}
}

export const createNetworkPresentationSession = (
	options: SessionOptions
): NetworkPresentationSession => createNetworkPresentationSessionFromDriver(
	acquireNetworkPresentationDriver(options.client, options.selector),
	options
)

type DriverSessionOptions = Omit<SessionOptions, 'client' | 'selector'>

const checkpointCellIds = new Set([
	'upgrade',
	'block',
	'fee-market',
	'native-price',
	'mempool',
	'epoch',
	'slot',
	'blocks',
	'transactions',
])

const validCheckpointEntries = (
	entries: readonly Readonly<{ id: string, fingerprint: string, count?: number, ordinal?: number }>[]
) => {
	const ids = new Set<string>()
	return entries.every((entry) => {
		if (entry === null || typeof entry !== 'object')
			return false
		const value = entry.count ?? entry.ordinal
		if (typeof entry.id !== 'string'
			|| entry.id.length === 0
			|| !checkpointCellIds.has(entry.id)
			|| typeof entry.fingerprint !== 'string'
			|| entry.fingerprint.length === 0
			|| value === undefined
			|| !Number.isSafeInteger(value)
			|| value < 0
			|| ids.has(entry.id))
			return false
		ids.add(entry.id)
		return true
	})
}

const checkpointMatches = (
	checkpoint: NetworkPresentationCheckpoint | undefined,
	selectorKey: string,
	persistenceGeneration: number
) => checkpoint !== undefined
	&& checkpoint !== null
	&& typeof checkpoint === 'object'
	&& checkpoint.schemaVersion === 1
	&& typeof checkpoint.selectorKey === 'string'
	&& checkpoint.selectorKey === selectorKey
	&& typeof checkpoint.revision === 'number'
	&& Number.isSafeInteger(checkpoint.revision)
	&& checkpoint.revision >= 0
	&& typeof checkpoint.route === 'string'
	&& typeof checkpoint.persistenceGeneration === 'number'
	&& Number.isSafeInteger(checkpoint.persistenceGeneration)
	&& checkpoint.persistenceGeneration >= 0
	&& checkpoint.persistenceGeneration + 1 === persistenceGeneration
	&& Array.isArray(checkpoint.observations)
	&& Array.isArray(checkpoint.failures)
	&& validCheckpointEntries(checkpoint.observations)
	&& validCheckpointEntries(checkpoint.failures)

export const createNetworkPresentationSessionFromDriver = (
	driver: NetworkPresentationDriver,
	options: DriverSessionOptions
): NetworkPresentationSession => {
	const { selectorKey, selector } = driver
	const caip2 = `${selector.caip2.namespace}:${selector.caip2.reference}`
	if (!Number.isSafeInteger(options.initialRevision) || options.initialRevision < 0)
		throw new Error('Network presentation initial revision must be a nonnegative safe integer')
	if (!Number.isSafeInteger(options.subscriptionGeneration) || options.subscriptionGeneration < 1)
		throw new Error('Network presentation subscription generation must be a positive safe integer')
	if (!Number.isSafeInteger(options.persistenceGeneration) || options.persistenceGeneration < 1)
		throw new Error('Network presentation persistence generation must be a positive safe integer')
	if (options.mountId.length === 0)
		throw new Error('Network presentation mount ID must not be empty')

	const restoredCheckpoint = checkpointMatches(options.checkpoint, selectorKey, options.persistenceGeneration)
		? options.checkpoint
		: undefined
	const canonicalRoute = `/network/${caip2}`
	const restoredRoute = restoredCheckpoint?.route
	let route = restoredRoute === canonicalRoute || restoredRoute?.startsWith(`${canonicalRoute}/`)
		? restoredRoute
		: options.route
	let expanded = true
	let selectedSection: 'blocks' | 'transactions' = 'blocks'
	let revision = restoredCheckpoint === undefined
		? options.initialRevision
		: restoredCheckpoint.revision + 1
	let destroyed = false
	let queued = false
	let settleClosed: (() => void) | undefined
	let rejectClosed: ((error: unknown) => void) | undefined
	const closed = new Promise<void>((resolve, reject) => {
		settleClosed = resolve
		rejectClosed = reject
	})
	const subscribers = new Set<(snapshot: NetworkEntityPresentationV1) => void>()
	const observations = new Map(
		(restoredCheckpoint?.observations ?? []).map(({ id, fingerprint, count }) => [id, { fingerprint, count }])
	)
	const failures = new Map(
		(restoredCheckpoint?.failures ?? []).map(({ id, fingerprint, ordinal }) => [id, { fingerprint, ordinal }])
	)
	const retryTokens = new Map<string, string>()
	let checkpointWrites = Promise.resolve()
	let checkpointFailure: unknown

	const observed = (id: string, value: { state: NetworkResourceState }) => {
		const fingerprint = stringify(value)
		const previous = observations.get(id)
		if (previous?.fingerprint === fingerprint)
			return previous.count
		const count = value.state === 'pending' ? previous?.count ?? 0 : (previous?.count ?? 0) + 1
		observations.set(id, { fingerprint, count })
		return count
	}

	const resourceCell = <Id extends NetworkSummaryId>(
		id: Id,
		label: NetworkSummaryDefinition[Id],
		owner: string,
		sources: readonly string[],
		materialized: NetworkPresentationMaterializedCell
	): NetworkResourceCellFor<Id> => {
		const observation = observed(id, materialized)
		const failureFingerprint = stringify(materialized)
		const previousFailure = failures.get(id)
		const failureOrdinal = materialized.state === 'failed'
			? previousFailure?.fingerprint === failureFingerprint
				? previousFailure.ordinal
				: (previousFailure?.ordinal ?? 0) + 1
			: previousFailure?.ordinal ?? 0
		if (materialized.state === 'failed')
			failures.set(id, { fingerprint: failureFingerprint, ordinal: failureOrdinal })
		else if (previousFailure !== undefined)
			failures.set(id, { fingerprint: `recovered:${failureFingerprint}`, ordinal: failureOrdinal })
		const retryToken = materialized.state === 'failed'
			? `retry-network-${id}-${failureOrdinal}`
			: null
		if (retryToken === null)
			retryTokens.delete(id)
		else
			retryTokens.set(id, retryToken)
		return { id, label, owner, sources, ...materialized, observation, retryToken }
	}

	const materializedCollection = (
		id: NetworkCollectionCell['id'],
		materialized: ReturnType<typeof materializeCollection>
	) => {
		const observation = observed(id, materialized)
		const failureFingerprint = stringify(materialized)
		const previousFailure = failures.get(id)
		const failureOrdinal = materialized.state === 'failed'
			? previousFailure?.fingerprint === failureFingerprint
				? previousFailure.ordinal
				: (previousFailure?.ordinal ?? 0) + 1
			: previousFailure?.ordinal ?? 0
		if (materialized.state === 'failed')
			failures.set(id, { fingerprint: failureFingerprint, ordinal: failureOrdinal })
		else if (previousFailure !== undefined)
			failures.set(id, { fingerprint: `recovered:${failureFingerprint}`, ordinal: failureOrdinal })
		const retryToken = materialized.state === 'failed' ? `retry-network-${id}-${failureOrdinal}` : null
		if (retryToken === null)
			retryTokens.delete(id)
		else
			retryTokens.set(id, retryToken)
		return { ...materialized, observation, retryToken }
	}
	const blocksCell = (
		materialized: ReturnType<typeof materializeCollection>
	): NetworkBlocksCollectionCell => ({
		id: 'blocks', label: 'Blocks', owner: 'Network.Evm.$$blocks',
		sources: [Source.Voltaire_JsonRpc], limit: 4,
		...materializedCollection('blocks', materialized),
	})
	const transactionsCell = (
		materialized: ReturnType<typeof materializeCollection>
	): NetworkTransactionsCollectionCell => ({
		id: 'transactions', label: 'Transactions', owner: 'Network.Evm.$$transactions',
		sources: [Source.Blockscout_Rest], limit: 16,
		...materializedCollection('transactions', materialized),
	})

	const snapshot = (snapshotRevision = revision): NetworkEntityPresentationV1 => {
		const values = driver.read()
		const navigation = options.navigation.map((item) => ({
			...item,
			selected: item.target === canonicalRoute
				? route === canonicalRoute || route.startsWith(`${canonicalRoute}/`)
				: item.target === route,
		}))
		const mainContentTitle = navigation.find((item) => item.target === canonicalRoute)?.label ?? values.title
		const detail = <Id extends NetworkDetailId>(
			id: Id,
			label: NetworkDetailDefinition[Id],
			value: string,
		): NetworkDetailRowFor<Id> => ({ id, label, value, fullValue: value })
		return freezePresentation({
			schemaVersion: 'NetworkEntityPresentationV1',
			revision: snapshotRevision,
			route,
			chrome: {
				brand: 'Blockhead',
				navigation,
				selectedTarget: canonicalRoute,
				mainContentLabel: `${mainContentTitle} network`,
			},
			entity: {
				entityType: 'Network', selectorKey, selector: { caip2: selector.caip2 },
				fallbackTitle: caip2, title: values.title, annotation: 'Network', value: caip2, expanded,
			},
			summary: [
				resourceCell('upgrade', 'Upgrade', 'Network.Evm.$$upgrades', [Source.Constants_Internal], values.summary.upgrade),
				resourceCell('block', 'Block', 'Network.Evm.$$blocks', [Source.Voltaire_JsonRpc], values.summary.block),
				resourceCell('fee-market', 'Fee market', 'Network.Evm.$$gasFeeBlocks', [Source.Voltaire_JsonRpc], values.summary.feeMarket),
				resourceCell(
					'native-price',
					'Native price',
					'Network.Evm.$nativeCoin/MarketPrice.$$quotes',
					[Source.Constants_Internal, Source.Coingecko_Rest],
					values.summary.nativePrice
				),
				resourceCell('mempool', 'Mempool', 'Network.Evm.$$txpoolTimestamps', [Source.Voltaire_JsonRpc], values.summary.mempool),
				resourceCell('epoch', 'Epoch', 'Network.Evm.$$beaconEpochs', [Source.Beacon_Rest], values.summary.epoch),
				resourceCell('slot', 'Slot', 'Network.Evm.$$beaconSlots', [Source.Beacon_Rest], values.summary.slot),
			],
			details: [
				detail('name', 'Name', values.details.name),
				detail('namespace', 'Namespace', values.details.namespace),
				detail('ledger-models', 'Ledger models', values.details.ledgerModels),
				detail('execution-models', 'Execution models', values.details.executionModels),
				detail('network-stack', 'Network stack', values.details.networkStack),
				detail('environment', 'Environment', values.details.environment),
				detail('caip2', 'CAIP-2', caip2),
			],
			execution: {
				label: 'Execution', selectedSection,
				sections: {
					blocks: blocksCell(values.blocks),
					transactions: transactionsCell(values.transactions),
				},
			},
			diagnostics: {
				mountId: options.mountId,
				subscriptionGeneration: options.subscriptionGeneration,
				activeSubscriptions: 1,
				persistenceGeneration: options.persistenceGeneration,
			},
		})
	}

	const presentationFingerprint = (presentation: NetworkEntityPresentationV1) => stringify({
		...presentation,
		revision: 0,
	})
	let current = snapshot()
	let currentFingerprint = presentationFingerprint(current)
	const makeCheckpoint = (): NetworkPresentationCheckpoint => Object.freeze({
		schemaVersion: 1,
		selectorKey,
		revision,
		route,
		persistenceGeneration: options.persistenceGeneration,
		observations: Object.freeze([...observations].map(([id, value]) => Object.freeze({ id, ...value }))),
		failures: Object.freeze([...failures].map(([id, value]) => Object.freeze({ id, ...value }))),
	})
	const persistCheckpoint = () => {
		if (options.saveCheckpoint === undefined)
			return
		const checkpoint = makeCheckpoint()
		checkpointWrites = checkpointWrites.then(async () => {
			try {
				await options.saveCheckpoint?.(checkpoint)
			} catch (error) {
				checkpointFailure ??= error
			}
		})
	}
	const publish = () => {
		if (destroyed)
			return
		const candidate = snapshot()
		const candidateFingerprint = presentationFingerprint(candidate)
		if (candidateFingerprint === currentFingerprint)
			return
		revision += 1
		current = snapshot()
		currentFingerprint = candidateFingerprint
		persistCheckpoint()
		for (const subscriber of subscribers)
			subscriber(current)
	}
	const schedule = () => {
		if (queued || destroyed)
			return
		queued = true
		queueMicrotask(() => {
			queued = false
			publish()
		})
	}
	const stop = driver.watch(schedule)

	const runAction = async (action: NetworkPresentationAction) => {
		if (destroyed)
			throw new Error('Network presentation session is destroyed')
		if (action.type === 'navigate') {
			await options.navigate(action.target, action.returnFocusKey)
			if (destroyed)
				throw new Error('Network presentation session was destroyed during navigation')
			route = action.target
		} else if (action.type === 'focus-main') {
			await options.focusMain()
			return
		} else if (action.type === 'back') {
			const target = await options.back()
			if (destroyed)
				throw new Error('Network presentation session was destroyed during back navigation')
			if (target !== canonicalRoute && !target.startsWith(`${canonicalRoute}/`))
				throw new Error(`Network presentation Back returned a foreign route: ${target}`)
			route = target
		} else if (action.type === 'set-expanded') {
			if (action.selectorKey !== selectorKey)
				throw new Error('Expanded action targets a different network')
			expanded = action.expanded
		} else if (action.type === 'select-section') {
			selectedSection = action.section
		} else {
			if (retryTokens.get(action.cellId) !== action.retryToken)
				throw new Error('Retry token is stale or belongs to a different cell')
			driver.retry(action.cellId)
			retryTokens.delete(action.cellId)
			return
		}
		schedule()
	}
	let actionDrain = Promise.resolve()
	const dispatch = (action: NetworkPresentationAction) => {
		const result = actionDrain.then(() => runAction(action))
		actionDrain = result.then(() => undefined, () => undefined)
		return result
	}

	return {
		get current() { return current },
		get checkpoint() { return makeCheckpoint() },
		subscribe(emit) {
			if (destroyed)
				throw new Error('Network presentation session is destroyed')
			if (subscribers.size !== 0)
				throw new Error('Network presentation session permits one aggregate subscriber')
			subscribers.add(emit)
			try {
				emit(current)
			} catch (error) {
				subscribers.delete(emit)
				throw error
			}
			return () => subscribers.delete(emit)
		},
		dispatch,
		destroy() {
			if (destroyed)
				return
			destroyed = true
			stop()
			subscribers.clear()
			void actionDrain.then(() => {
				persistCheckpoint()
				return checkpointWrites
			}).then(() => {
				if (checkpointFailure === undefined)
					settleClosed?.()
				else
					rejectClosed?.(checkpointFailure)
				settleClosed = undefined
				rejectClosed = undefined
			})
		},
		closed,
	}
}
