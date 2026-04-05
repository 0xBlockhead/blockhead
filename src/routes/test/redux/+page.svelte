<script lang="ts">
	// Types/constants — pipeline mirrors app layers; entity shape matches `$schema` / `$EntityDefinition`.

	import type { QueryFunctionContext, QueryKey } from '@tanstack/query-core'
	import { QueryClient } from '@tanstack/query-core'
	import { queryCollectionOptions } from '@tanstack/query-db-collection'
	import type { LoadSubsetOptions } from '@tanstack/svelte-db'
	import {
		and,
		createCollection,
		eq,
		parseLoadSubsetOptions,
		useLiveQuery,
	} from '@tanstack/svelte-db'
	import { Rpc } from '@tevm/voltaire/jsonrpc'
	import { Hex } from '@tevm/voltaire/Hex'
	import { HttpProvider } from '@tevm/voltaire/provider'
	import { parse, stringify } from 'devalue'
	import { ProposalCategory } from '$/constants/Proposal/ProposalCategory.ts'
	import { ProposalRealm } from '$/constants/Proposal/ProposalRealm.ts'
	import { EntityFieldType } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import _GlobalEntityDefinition from '$/schema/_Global.ts'
	import EvmBlockEntityDefinition from '$/schema/EvmBlock.ts'
	import EvmTransactionEntityDefinition from '$/schema/EvmTransaction.ts'
	import NetworkEntityDefinition from '$/schema/Network.ts'
	import ProposalEntityDefinition from '$/schema/Proposal.ts'
	import { Source } from '$/sources/$Sources.ts'

	/** Definitions shown in the schema reference (pipeline entities + `Proposal` target of `$$proposalsEips`). */
	const referencedEntityDefinitions = [
		_GlobalEntityDefinition,
		ProposalEntityDefinition,
		NetworkEntityDefinition,
		EvmBlockEntityDefinition,
		EvmTransactionEntityDefinition,
	] as const

	const pipelineRootEntityDefinitions = [
		_GlobalEntityDefinition,
		NetworkEntityDefinition,
		EvmBlockEntityDefinition,
		EvmTransactionEntityDefinition,
	] as const

	const pipelineFieldNamesByEntityType: Partial<Record<EntityType, readonly string[]>> = {
		[EntityType._Global]: ['$$proposalsEips'],
		[EntityType.Network]: ['$$evmBlocks'],
		[EntityType.EvmBlock]: ['$$evmTransactions'],
		[EntityType.EvmTransaction]: ['status', 'gasUsed'],
	}

	/** Subset of fields on this page that have `entityFieldCollections` + resolvers wired up. */
	const schema = pipelineRootEntityDefinitions.map((definition) => ({
		entityType: definition.entityType,
		fields: definition.fields.filter((field) => (
			pipelineFieldNamesByEntityType[definition.entityType]?.includes(field.name) ?? false
		)),
	}))

	type PipelineEntityType = (typeof schema)[number]['entityType']

	const arkTypeSummary = (typeNode: { description?: string; expression?: string }) => (
		typeNode.description ?? typeNode.expression ?? '—'
	)

	/** Same wire keys as `$/schema/$EntityCollectionRow.ts`. */
	const entityCollectionRow = {
		id: '$id',
		idKey: '$idKey',
		source: '$source',
		fieldScopeKey: '$fieldScopeKey',
	} as const

	type EntityId = Record<string, unknown>

	/** Row shape for `entityCollections` (TanStack query-db-collection generic). */
	type DemoEntityCollectionRow = Record<string, unknown> & {
		'$id': EntityId
		'$idKey': string
		'$source': Source
	}

	/** Row shape for `entityFieldCollections` (join keys + domain fields). */
	type DemoEntityFieldCollectionRow = Record<string, unknown> & {
		'$idKey': string
		'$source': Source
		'$fieldScopeKey': string
	}

	const serializeEntityId = (entityId: EntityId) => stringify(entityId)

	const parseEntityId = (key: string): EntityId | null => {
		if (!key || key === '{}') return null
		try {
			const parsed = parse(key)
			if (parsed == null) return null
			if (typeof parsed !== 'object' || Array.isArray(parsed)) return null
			return parsed as EntityId
		} catch {
			return null
		}
	}

	const entry = <Key extends PropertyKey, Value>(key: Key, value: Value): readonly [Key, Value] => [
		key,
		value,
	]

	const CHAIN_ID = 1

	const rpcUrl = (
		(
			import.meta.env.PUBLIC_ETH_RPC_URL != null &&
			String(import.meta.env.PUBLIC_ETH_RPC_URL).length > 0
		) ?
			String(import.meta.env.PUBLIC_ETH_RPC_URL)
		:	'https://ethereum.publicnode.com'
	)

	const rpcProvider = new HttpProvider(rpcUrl)

	// --- Sources (Voltaire JSON-RPC, minimal) ---
	const getChainHeadNumber = async (): Promise<bigint> => {
		const hex = await rpcProvider.request(Rpc.Eth.BlockNumberRequest()) as string
		return BigInt(hex)
	}

	const getBlockByNumber = async ({
		blockNumber,
		fullTransactions = false,
	}: {
		blockNumber: bigint | 'latest'
		fullTransactions?: boolean
	}) => {
		const blockTag = (
			blockNumber === 'latest' ? 'latest' : (
				Hex.fromBigInt(BigInt(blockNumber)) as `0x${string}`
			)
		)
		return rpcProvider.request(
			Rpc.Eth.GetBlockByNumberRequest(blockTag, fullTransactions),
		) as Promise<Record<string, unknown> | null>
	}

	const getTransactionReceipt = async (txHash: `0x${string}`) => (
		rpcProvider.request(
			Rpc.Eth.GetTransactionReceiptRequest(txHash as never),
		) as Promise<Record<string, unknown> | null>
	)

	const stubTxEntitiesFromBlockWire = ({
		chainId,
		transactions,
		cap,
	}: {
		chainId: number
		transactions: unknown
		cap: number
	}): { $id: EntityId }[] => {
		const hashes: `0x${string}`[] = []
		if (Array.isArray(transactions) && cap > 0) {
			for (const transactionWire of transactions) {
				if (hashes.length >= cap) break
				if (typeof transactionWire === 'string' && transactionWire.startsWith('0x')) {
					hashes.push(transactionWire as `0x${string}`)
					continue
				}
				if (
					transactionWire != null &&
					typeof transactionWire === 'object' &&
					'hash' in transactionWire
				) {
					const hash = (transactionWire as { hash?: string }).hash
					if (typeof hash === 'string' && hash.startsWith('0x')) {
						hashes.push(hash as `0x${string}`)
					}
				}
			}
		}
		return hashes.map((txHash) => ({
			$id: {
				$network: { chainId },
				txHash,
			},
		}))
	}

	// --- Load-subset → resolver context (minimal `$/data/tanstackDb/*`) ---
	const subsetParsed = (loadSubsetOptions: LoadSubsetOptions | undefined) => (
		loadSubsetOptions == null ?
			{ filters: [], sorts: [] }
		:	parseLoadSubsetOptions(loadSubsetOptions)
	)

	const resolverContextFromLoadSubset = (opts: LoadSubsetOptions | undefined) => {
		if (opts == null) return undefined
		const { filters, limit } = subsetParsed(opts)
		return {
			loadSubset: {
				filters,
				limit,
				offset: opts.offset,
			},
		}
	}

	const rowKeyEqValue = (
		filters: { field: readonly unknown[]; operator: string; value?: unknown }[],
		rowKey: string,
	) =>
		filters.find(
			(filterRow) =>
				filterRow.operator === 'eq' &&
				(
					filterRow.field.map(String).join('.') === rowKey ||
					(
						filterRow.field.length > 0 &&
						String(filterRow.field[filterRow.field.length - 1]) === rowKey
					)
				),
		)?.value

	const emptyGlobalScopeKey = serializeEntityId({})

	const isGlobalScopeKey = (idKeyWire: string) => (
		idKeyWire === emptyGlobalScopeKey ||
		idKeyWire === '{}'
	)

	type EntityFieldResolverContext = NonNullable<
		ReturnType<typeof resolverContextFromLoadSubset>
	>

	// Props
	let {
		proposalEntityId = {
			realm: ProposalRealm.Ethereum,
			kind: ProposalCategory.Eip,
			number: 1,
		} as EntityId,
	}: {
		proposalEntityId?: EntityId
	} = $props()

	// State
	const queryClient = new QueryClient()

	const eipSeedRows = [
		entry(
			serializeEntityId({
				realm: ProposalRealm.Ethereum,
				kind: ProposalCategory.Eip,
				number: 1,
			}),
			{
				realm: ProposalRealm.Ethereum,
				kind: ProposalCategory.Eip,
				number: 1,
				name: 'EIP-1',
			},
		),
		entry(
			serializeEntityId({
				realm: ProposalRealm.Ethereum,
				kind: ProposalCategory.Eip,
				number: 2,
			}),
			{
				realm: ProposalRealm.Ethereum,
				kind: ProposalCategory.Eip,
				number: 2,
				name: 'EIP-2',
			},
		),
	]

	const EIPS_BY_ENTITY_ID_KEY = Object.fromEntries(eipSeedRows)

	// --- Resolvers (entity list + partial row + field rows) ---
	const entityResolvers: {
		entityType: PipelineEntityType
		resolve: (
			entityId: EntityId,
			context?: EntityFieldResolverContext,
		) => Promise<Record<string, unknown>>
	}[] = [
		{
			entityType: EntityType._Global,
			resolve: async () => ({}),
		},
		{
			entityType: EntityType.Network,
			resolve: async (entityId) => ({
				name: 'Network',
				rpcUrl,
				chainId: entityId.chainId,
			}),
		},
		{
			entityType: EntityType.EvmBlock,
			resolve: async (entityId) => {
				const blockNumber = entityId.blockNumber
				if (typeof blockNumber !== 'bigint') return {}
				try {
					const wire = await getBlockByNumber({
						blockNumber,
						fullTransactions: false,
					})
					if (wire == null) return {}
					const timestampWire = wire.timestamp
					return {
						number: blockNumber,
						timestamp: (
							typeof timestampWire === 'string' ?
								Number.parseInt(timestampWire, 16)
							:	typeof timestampWire === 'number' ?
								timestampWire
							:	undefined
						),
						gasUsed: typeof wire.gasUsed === 'string' ? BigInt(wire.gasUsed) : undefined,
						gasLimit: typeof wire.gasLimit === 'string' ? BigInt(wire.gasLimit) : undefined,
					}
				} catch {
					return {}
				}
			},
		},
		{
			entityType: EntityType.EvmTransaction,
			resolve: async (entityId) => {
				const txHash = entityId.txHash
				if (typeof txHash !== 'string' || !txHash.startsWith('0x')) return {}
				try {
					const transactionWire = await rpcProvider.request(
						Rpc.Eth.GetTransactionByHashRequest(txHash as never),
					) as Record<string, unknown> | null
					if (transactionWire == null) return {}
					return {
						value: typeof transactionWire.value === 'string' ?
							BigInt(transactionWire.value)
						:	0n,
						gas: typeof transactionWire.gas === 'string' ?
							BigInt(transactionWire.gas)
						:	undefined,
						nonce: typeof transactionWire.nonce === 'string' ?
							Number.parseInt(transactionWire.nonce, 16)
						:	undefined,
					}
				} catch {
					return {}
				}
			},
		},
	]

	const entityFieldResolvers: {
		entityType: PipelineEntityType
		field: string
		source: Source
		resolve: (
			scopedEntityId: EntityId,
			fieldResolverContext?: EntityFieldResolverContext,
		) => Promise<unknown>
	}[] = [
		{
			entityType: EntityType._Global,
			field: '$$proposalsEips',
			source: Source.Local,
			resolve: async () => (
				Object.values(EIPS_BY_ENTITY_ID_KEY).map((eip) => ({
					...eip,
					[entityCollectionRow.id]: {
						realm: eip.realm,
						kind: eip.kind,
						number: eip.number,
					},
				}))
			),
		},
		{
			entityType: EntityType.Network,
			field: '$$evmBlocks',
			source: Source.Voltaire,
			resolve: async () => {
				try {
					const chainHead = await getChainHeadNumber()
					const wire = await getBlockByNumber({
						blockNumber: chainHead,
						fullTransactions: false,
					})
					return [
						{
							[entityCollectionRow.id]: {
								$network: {
									chainId: CHAIN_ID,
								},
								blockNumber: chainHead,
							},
							number: chainHead,
							hash: typeof wire?.hash === 'string' ? wire.hash : undefined,
						},
					]
				} catch {
					return []
				}
			},
		},
		{
			entityType: EntityType.EvmBlock,
			field: '$$evmTransactions',
			source: Source.Voltaire,
			resolve: async (scopedEntityId) => {
				const blockNumber = scopedEntityId.blockNumber
				if (typeof blockNumber !== 'bigint') return []
				try {
					const wire = await getBlockByNumber({
						blockNumber,
						fullTransactions: true,
					})
					return stubTxEntitiesFromBlockWire({
						chainId: CHAIN_ID,
						transactions: wire?.transactions,
						cap: 8,
					})
				} catch {
					return []
				}
			},
		},
		{
			entityType: EntityType.EvmTransaction,
			field: 'status',
			source: Source.Voltaire,
			resolve: async (scopedEntityId) => {
				const txHash = scopedEntityId.txHash
				if (typeof txHash !== 'string' || !txHash.startsWith('0x')) return undefined
				try {
					const receipt = await getTransactionReceipt(txHash as `0x${string}`)
					const statusWire = receipt?.status
					if (typeof statusWire !== 'string') return undefined
					return Number.parseInt(statusWire, 16)
				} catch {
					return undefined
				}
			},
		},
		{
			entityType: EntityType.EvmTransaction,
			field: 'gasUsed',
			source: Source.Voltaire,
			resolve: async (scopedEntityId) => {
				const txHash = scopedEntityId.txHash
				if (typeof txHash !== 'string' || !txHash.startsWith('0x')) return undefined
				try {
					const receipt = await getTransactionReceipt(txHash as `0x${string}`)
					const gasUsedWire = receipt?.gasUsed
					if (typeof gasUsedWire !== 'string') return undefined
					return BigInt(gasUsedWire)
				} catch {
					return undefined
				}
			},
		},
	]

	// --- Entity collections + entity field collections (`queryCollectionOptions` + `createCollection`) ---
	type SchemaEntry = (typeof schema)[number]
	type SchemaField = SchemaEntry['fields'][number]

	const demoEntityCollectionFor = (schemaEntry: SchemaEntry) => (
		createCollection(
			queryCollectionOptions<DemoEntityCollectionRow>({
				syncMode: 'on-demand',
				queryKey: [schemaEntry.entityType, 'entity'],
				queryFn: async ({ meta }: QueryFunctionContext<QueryKey>) => {
					const loadSubsetOptions = meta?.loadSubsetOptions
					let entityIds: EntityId[]
					if (schemaEntry.entityType === EntityType._Global) {
						entityIds = [{}]
					} else if (schemaEntry.entityType === EntityType.Network) {
						entityIds = [{ chainId: CHAIN_ID }]
					} else if (schemaEntry.entityType === EntityType.EvmBlock) {
						try {
							const chainHead = await getChainHeadNumber()
							entityIds = [
								{
									$network: {
										chainId: CHAIN_ID,
									},
									blockNumber: chainHead,
								},
							]
						} catch {
							entityIds = []
						}
					} else if (schemaEntry.entityType === EntityType.EvmTransaction) {
						try {
							const chainHead = await getChainHeadNumber()
							const wire = await getBlockByNumber({
								blockNumber: chainHead,
								fullTransactions: true,
							})
							entityIds = stubTxEntitiesFromBlockWire({
								chainId: CHAIN_ID,
								transactions: wire?.transactions,
								cap: 8,
							}).map((stub) => stub.$id)
						} catch {
							entityIds = []
						}
					} else {
						entityIds = []
					}

					const baseSources: Source[] = (
						schemaEntry.entityType === EntityType._Global ?
							[Source.Local]
						:	[Source.Voltaire]
					)
					const subsetContext = resolverContextFromLoadSubset(loadSubsetOptions)
					const rowsBySource = await Promise.all(
						baseSources.map(async (source) => (
							Promise.all(
								entityIds.map(async (entityId) => {
									const resolverEntry = entityResolvers.find(
										(candidate) => candidate.entityType === schemaEntry.entityType,
									)
									const partial = (
										resolverEntry == null ?
											{}
										:	await resolverEntry.resolve(entityId, subsetContext)
									)
									return {
										...partial,
										[entityCollectionRow.id]: entityId,
										[entityCollectionRow.idKey]: serializeEntityId(entityId),
										[entityCollectionRow.source]: source,
									}
								}),
							)
						)),
					)
					return rowsBySource.flat()
				},
				queryClient,
				getKey: (item) => (
					`${String(item[entityCollectionRow.source] ?? '')}\0${String(item[entityCollectionRow.idKey] ?? '')}`
				),
			}),
		)
	)

	const entityCollections = Object.fromEntries(
		schema.map((schemaEntry) => (
			entry(schemaEntry.entityType, demoEntityCollectionFor(schemaEntry))
		)),
	) as unknown as Record<PipelineEntityType, ReturnType<typeof demoEntityCollectionFor>>

	const demoEntityFieldCollectionFor = (
		entityDefinition: SchemaEntry,
		field: SchemaField,
	) => (
		createCollection(
			queryCollectionOptions<DemoEntityFieldCollectionRow>({
				syncMode: 'on-demand',
				queryKey: [entityDefinition.entityType, field.name],
				queryFn: async ({ meta }: QueryFunctionContext<QueryKey>) => {
					const loadSubsetOptions = meta?.loadSubsetOptions
					const filters = subsetParsed(loadSubsetOptions).filters
					const idKeyEq = rowKeyEqValue(filters, entityCollectionRow.idKey)
					const idKeyFromFilter = typeof idKeyEq === 'string' && idKeyEq.length > 0 ?
						idKeyEq
					:	null

					let parsedEntityId = null as EntityId | null
					if (
						idKeyFromFilter != null &&
						!isGlobalScopeKey(idKeyFromFilter)
					)
						parsedEntityId = parseEntityId(idKeyFromFilter)

					if (parsedEntityId == null) {
						const idEq = rowKeyEqValue(filters, entityCollectionRow.id)
						if (idEq != null && typeof idEq === 'object' && !Array.isArray(idEq))
							parsedEntityId = idEq as EntityId
						else if (typeof idEq === 'string' && idEq.length > 0)
							parsedEntityId = parseEntityId(idEq)
					}

					const idKeyWire = (
						idKeyFromFilter ??
						(
							parsedEntityId != null ?
								serializeEntityId(parsedEntityId)
							:	emptyGlobalScopeKey
						)
					)

					const scopedEntityId = (
						parsedEntityId ??
						(
							isGlobalScopeKey(idKeyWire) ?
								(
									entityDefinition.entityType === EntityType._Global ?
										{}
									:	null
								)
							:	null
						)
					)
					if (scopedEntityId == null) return []

					const subsetContext = resolverContextFromLoadSubset(loadSubsetOptions)
					const fieldSources: Source[] = (
						entityDefinition.entityType === EntityType._Global &&
						field.name === '$$proposalsEips' ?
							[Source.Local]
						:	[Source.Voltaire]
					)
					const rowsBySource = await Promise.all(
						fieldSources.map(async (source) => {
							const fieldResolverEntry = entityFieldResolvers.find(
								(candidate) =>
									candidate.entityType === entityDefinition.entityType &&
									candidate.field === field.name &&
									candidate.source === source,
							)
							const raw = (
								fieldResolverEntry == null ?
									undefined
								:	await fieldResolverEntry.resolve(scopedEntityId, subsetContext)
							)
							if (raw === undefined) return []

							const list = (
								Array.isArray(raw) ?
									raw
								:	[raw]
							)
								.filter((element) => element != null)

							return list.map((element): DemoEntityFieldCollectionRow => {
								const scopeWire = serializeEntityId(scopedEntityId)
								const scopeFields = {
									[entityCollectionRow.fieldScopeKey]: scopeWire,
								}
								const sourceFields = {
									[entityCollectionRow.source]: source,
								}
								if (
									typeof element !== 'object' ||
									element == null ||
									Array.isArray(element)
								) {
									return {
										...scopeFields,
										...sourceFields,
										value: element,
										[entityCollectionRow.id]: scopedEntityId,
										[entityCollectionRow.idKey]: scopeWire,
									}
								}
								const rowRecord = element as Record<string, unknown>
								const nestedEntityId = rowRecord[entityCollectionRow.id]
								return (
									nestedEntityId != null &&
									typeof nestedEntityId === 'object' &&
									!Array.isArray(nestedEntityId) ?
										{
											...scopeFields,
											...sourceFields,
											...rowRecord,
											[entityCollectionRow.idKey]: serializeEntityId(
												nestedEntityId as EntityId,
											),
										}
									:	{
											...scopeFields,
											...sourceFields,
											...rowRecord,
											[entityCollectionRow.id]: scopedEntityId,
											[entityCollectionRow.idKey]: scopeWire,
										}
								)
							})
						}),
					)

					return rowsBySource.flat()
				},
				queryClient,
				getKey: (item) => (
					`${String(item[entityCollectionRow.source] ?? '')}\0${String(item[entityCollectionRow.idKey] ?? '')}`
				),
			}),
		)
	)

	const entityFieldCollections = Object.fromEntries(
		schema.map((entityDefinition) => (
			entry(
				entityDefinition.entityType,
				Object.fromEntries(
					entityDefinition.fields.map((field) => (
						entry(
							field.name,
							demoEntityFieldCollectionFor(entityDefinition, field),
						)
					)),
				),
			)
		)),
	) as unknown as Record<
		PipelineEntityType,
		Record<string, ReturnType<typeof demoEntityFieldCollectionFor>>
	>

	const jsonForDisplay = (value: unknown) =>
		JSON.stringify(
			value,
			(_key, inner) => (typeof inner === 'bigint' ? inner.toString() : inner),
			2,
		)

	// --- Live scans: every entity + field collection (full rows) ---
	const liveGlobalEntities = useLiveQuery((queryBuilder) => (
		queryBuilder
			.from({ row: entityCollections[EntityType._Global] })
			.select(({ row }) => ({ row }))
	))

	const liveGlobalFieldProposals = useLiveQuery((queryBuilder) => (
		queryBuilder
			.from({
				row: entityFieldCollections[EntityType._Global]['$$proposalsEips'],
			})
			.select(({ row }) => ({ row }))
	))

	const liveNetworkEntities = useLiveQuery((queryBuilder) => (
		queryBuilder
			.from({ row: entityCollections[EntityType.Network] })
			.select(({ row }) => ({ row }))
	))

	const liveNetworkFieldBlocks = useLiveQuery((queryBuilder) => (
		queryBuilder
			.from({
				row: entityFieldCollections[EntityType.Network]['$$evmBlocks'],
			})
			.select(({ row }) => ({ row }))
	))

	const liveBlockEntities = useLiveQuery((queryBuilder) => (
		queryBuilder
			.from({ row: entityCollections[EntityType.EvmBlock] })
			.select(({ row }) => ({ row }))
	))

	const liveBlockFieldTransactions = useLiveQuery((queryBuilder) => (
		queryBuilder
			.from({
				row: entityFieldCollections[EntityType.EvmBlock]['$$evmTransactions'],
			})
			.select(({ row }) => ({ row }))
	))

	const liveTransactionEntities = useLiveQuery((queryBuilder) => (
		queryBuilder
			.from({ row: entityCollections[EntityType.EvmTransaction] })
			.select(({ row }) => ({ row }))
	))

	const liveTransactionFieldStatus = useLiveQuery((queryBuilder) => (
		queryBuilder
			.from({
				row: entityFieldCollections[EntityType.EvmTransaction].status,
			})
			.select(({ row }) => ({ row }))
	))

	const liveTransactionFieldGasUsed = useLiveQuery((queryBuilder) => (
		queryBuilder
			.from({
				row: entityFieldCollections[EntityType.EvmTransaction].gasUsed,
			})
			.select(({ row }) => ({ row }))
	))

	// --- TanStack DB live queries (join pipeline) ---
	// Join callbacks must be a single `eq(left, right)` — not `and(eq, eq)` (QueryBuilderError at runtime).
	const proposalsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ globalRow: entityCollections[EntityType._Global] })
				.innerJoin(
					{
						proposalFieldRow: entityFieldCollections[EntityType._Global][
							'$$proposalsEips'
						],
					},
					({ globalRow, proposalFieldRow }) => (
						eq(
							globalRow[entityCollectionRow.idKey],
							proposalFieldRow[entityCollectionRow.fieldScopeKey],
						)
					),
				)
				.where(({ proposalFieldRow }) => (
					and(
						eq(proposalFieldRow.realm, proposalEntityId.realm),
						eq(proposalFieldRow.kind, proposalEntityId.kind),
						eq(proposalFieldRow.number, proposalEntityId.number),
					)
				))
				.select(({ proposalFieldRow }) => ({
					row: proposalFieldRow,
				}))
		),
		[
			() => proposalEntityId.realm,
			() => proposalEntityId.kind,
			() => proposalEntityId.number,
		],
	)

	const chainQuery = useLiveQuery((queryBuilder) => (
		queryBuilder
			.from({ networkRow: entityCollections[EntityType.Network] })
			.innerJoin(
				{
					networkBlocksField: entityFieldCollections[EntityType.Network][
						'$$evmBlocks'
					],
				},
				({ networkRow, networkBlocksField }) => (
					eq(
						networkRow[entityCollectionRow.idKey],
						networkBlocksField[entityCollectionRow.fieldScopeKey],
					)
				),
			)
			.innerJoin(
				{ blockRow: entityCollections[EntityType.EvmBlock] },
				({ networkBlocksField, blockRow }) => (
					eq(
						networkBlocksField[entityCollectionRow.idKey],
						blockRow[entityCollectionRow.idKey],
					)
				),
			)
			.innerJoin(
				{
					blockTransactionsField: entityFieldCollections[EntityType.EvmBlock][
						'$$evmTransactions'
					],
				},
				({ blockRow, blockTransactionsField }) => (
					eq(
						blockRow[entityCollectionRow.idKey],
						blockTransactionsField[entityCollectionRow.fieldScopeKey],
					)
				),
			)
			.innerJoin(
				{ transactionRow: entityCollections[EntityType.EvmTransaction] },
				({ blockTransactionsField, transactionRow }) => (
					eq(
						blockTransactionsField[entityCollectionRow.idKey],
						transactionRow[entityCollectionRow.idKey],
					)
				),
			)
			.innerJoin(
				{
					receiptStatusField: entityFieldCollections[EntityType.EvmTransaction].status,
				},
				({ transactionRow, receiptStatusField }) => (
					eq(
						transactionRow[entityCollectionRow.idKey],
						receiptStatusField[entityCollectionRow.fieldScopeKey],
					)
				),
			)
			.innerJoin(
				{
					receiptGasUsedField: entityFieldCollections[EntityType.EvmTransaction].gasUsed,
				},
				({ transactionRow, receiptGasUsedField }) => (
					eq(
						transactionRow[entityCollectionRow.idKey],
						receiptGasUsedField[entityCollectionRow.fieldScopeKey],
					)
				),
			)
			.select(({
				networkRow,
				blockRow,
				transactionRow,
				receiptStatusField,
				receiptGasUsedField,
			}) => {
				const asDecimalString = (value: unknown): string => {
					if (value == null) return ''
					if (typeof value === 'bigint') return value.toString()
					if (typeof value === 'number' && Number.isFinite(value)) return String(value)
					if (typeof value === 'string') return value
					if (typeof value === 'boolean') return value ? '1' : '0'
					if (typeof value === 'object') {
						const maybeValueOf = value as { valueOf?: () => unknown }
						if (typeof maybeValueOf.valueOf === 'function') {
							try {
								const unboxed = maybeValueOf.valueOf()
								if (typeof unboxed === 'bigint') return unboxed.toString()
								if (
									typeof unboxed === 'number' &&
									Number.isFinite(unboxed)
								) {
									return String(unboxed)
								}
								if (typeof unboxed === 'string') return unboxed
							} catch {
								return ''
							}
						}
						return ''
					}
					try {
						return String(value)
					} catch {
						return ''
					}
				}
				const networkEntityId = networkRow[entityCollectionRow.id] as EntityId
				const blockEntityId = blockRow[entityCollectionRow.id] as EntityId
				const transactionEntityId = transactionRow[entityCollectionRow.id] as EntityId
				return {
					chainId: typeof networkEntityId.chainId === 'number' ? networkEntityId.chainId : 0,
					blockNumber: asDecimalString(blockEntityId.blockNumber),
					txHash: typeof transactionEntityId.txHash === 'string' ?
						transactionEntityId.txHash
					:	'',
					txValue: asDecimalString(transactionRow.value),
					status: typeof receiptStatusField.value === 'number' ?
						receiptStatusField.value
					:	-1,
					gasUsed: asDecimalString(receiptGasUsedField.value),
				}
			})
	))
</script>

<section data-card>
	<h2>App schema reference</h2>
	<p>
		Entity definitions imported from
		<code>$/schema</code>
		— id shape (ArkType), field type, cardinality, ref targets, and
		<code>defaultSources</code>
		match the codebase. This page’s collections only load the pipeline subset listed below.
	</p>

	{#each referencedEntityDefinitions as entityDefinition (entityDefinition.entityType)}
		<details class="schema-entity">
			<summary>
				<strong>{entityDefinition.label}</strong>
				<code>{entityDefinition.entityType}</code>
			</summary>
			<p class="schema-id-line">
				Id:
				<code>{arkTypeSummary(entityDefinition.id)}</code>
			</p>
			<ul class="schema-field-list">
				{#each entityDefinition.fields as field (field.name)}
					<li>
						<code>{field.name}</code>
						— type
						<code>{field.type}</code>
						— cardinality
						<code>{field.cardinality}</code>
						{#if field.type === EntityFieldType.Primitive}
							— primitive
							<code>{arkTypeSummary(field.primitiveType)}</code>
							{#if 'defaultSources' in field && field.defaultSources != null && field.defaultSources.length > 0}
								— sources
								<code>{field.defaultSources.join(', ')}</code>
							{/if}
						{:else}
							— ref
							<code>{field.entityType}</code>
							{#if 'defaultSources' in field && field.defaultSources != null && field.defaultSources.length > 0}
								— sources
								<code>{field.defaultSources.join(', ')}</code>
							{/if}
						{/if}
					</li>
				{/each}
			</ul>
		</details>
	{/each}

	<h3>Pipeline field collections on this page</h3>
	<ul class="schema-pipeline-list">
		{#each schema as pipelineEntry (pipelineEntry.entityType)}
			<li>
				<code>{pipelineEntry.entityType}</code>
				:
				{#each pipelineEntry.fields as pipelineField (pipelineField.name)}
					<code>{pipelineField.name}</code>
					{' '}
				{/each}
			</li>
		{/each}
	</ul>
</section>

<section data-card>
	<h2>Collection contents (entity rows + field rows)</h2>
	<p class="collection-overview-lead">
		Nested
		<code>details</code>
		per entity type; field collections sit under their entity.
	</p>

	<details class="collection-domain">
		<summary>
			<code>{EntityType._Global}</code>
			entity collection
		</summary>
		{#if liveGlobalEntities.isLoading}
			<p>Loading…</p>
		{:else}
			<ul class="collection-rows">
				{#each liveGlobalEntities.data ?? [] as { row }, index (String(row[entityCollectionRow.idKey] ?? index))}
					<li>
						<pre class="collection-row-json">{jsonForDisplay(row)}</pre>
					</li>
				{/each}
			</ul>
		{/if}
		<details class="collection-field">
			<summary>
				Field
				<code>$$proposalsEips</code>
			</summary>
			{#if liveGlobalFieldProposals.isLoading}
				<p>Loading…</p>
			{:else}
				<ul class="collection-rows">
					{#each liveGlobalFieldProposals.data ?? [] as { row }, index (String(row[entityCollectionRow.idKey] ?? index))}
						<li>
							<pre class="collection-row-json">{jsonForDisplay(row)}</pre>
						</li>
					{/each}
				</ul>
			{/if}
		</details>
	</details>

	<details class="collection-domain">
		<summary>
			<code>{EntityType.Network}</code>
			entity collection
		</summary>
		{#if liveNetworkEntities.isLoading}
			<p>Loading…</p>
		{:else}
			<ul class="collection-rows">
				{#each liveNetworkEntities.data ?? [] as { row }, index (String(row[entityCollectionRow.idKey] ?? index))}
					<li>
						<pre class="collection-row-json">{jsonForDisplay(row)}</pre>
					</li>
				{/each}
			</ul>
		{/if}
		<details class="collection-field">
			<summary>
				Field
				<code>$$evmBlocks</code>
			</summary>
			{#if liveNetworkFieldBlocks.isLoading}
				<p>Loading…</p>
			{:else}
				<ul class="collection-rows">
					{#each liveNetworkFieldBlocks.data ?? [] as { row }, index (String(row[entityCollectionRow.idKey] ?? index))}
						<li>
							<pre class="collection-row-json">{jsonForDisplay(row)}</pre>
						</li>
					{/each}
				</ul>
			{/if}
		</details>
	</details>

	<details class="collection-domain">
		<summary>
			<code>{EntityType.EvmBlock}</code>
			entity collection
		</summary>
		{#if liveBlockEntities.isLoading}
			<p>Loading…</p>
		{:else}
			<ul class="collection-rows">
				{#each liveBlockEntities.data ?? [] as { row }, index (String(row[entityCollectionRow.idKey] ?? index))}
					<li>
						<pre class="collection-row-json">{jsonForDisplay(row)}</pre>
					</li>
				{/each}
			</ul>
		{/if}
		<details class="collection-field">
			<summary>
				Field
				<code>$$evmTransactions</code>
			</summary>
			{#if liveBlockFieldTransactions.isLoading}
				<p>Loading…</p>
			{:else}
				<ul class="collection-rows">
					{#each liveBlockFieldTransactions.data ?? [] as { row }, index (String(row[entityCollectionRow.idKey] ?? index))}
						<li>
							<pre class="collection-row-json">{jsonForDisplay(row)}</pre>
						</li>
					{/each}
				</ul>
			{/if}
		</details>
	</details>

	<details class="collection-domain">
		<summary>
			<code>{EntityType.EvmTransaction}</code>
			entity collection
		</summary>
		{#if liveTransactionEntities.isLoading}
			<p>Loading…</p>
		{:else}
			<ul class="collection-rows">
				{#each liveTransactionEntities.data ?? [] as { row }, index (String(row[entityCollectionRow.idKey] ?? index))}
					<li>
						<pre class="collection-row-json">{jsonForDisplay(row)}</pre>
					</li>
				{/each}
			</ul>
		{/if}
		<details class="collection-field">
			<summary>
				Field
				<code>status</code>
			</summary>
			{#if liveTransactionFieldStatus.isLoading}
				<p>Loading…</p>
			{:else}
				<ul class="collection-rows">
					{#each liveTransactionFieldStatus.data ?? [] as { row }, index (String(row[entityCollectionRow.idKey] ?? index))}
						<li>
							<pre class="collection-row-json">{jsonForDisplay(row)}</pre>
						</li>
					{/each}
				</ul>
			{/if}
		</details>
		<details class="collection-field">
			<summary>
				Field
				<code>gasUsed</code>
			</summary>
			{#if liveTransactionFieldGasUsed.isLoading}
				<p>Loading…</p>
			{:else}
				<ul class="collection-rows">
					{#each liveTransactionFieldGasUsed.data ?? [] as { row }, index (String(row[entityCollectionRow.idKey] ?? index))}
						<li>
							<pre class="collection-row-json">{jsonForDisplay(row)}</pre>
						</li>
					{/each}
				</ul>
			{/if}
		</details>
	</details>
</section>

<section data-card>
	<h2>Joined query: proposals (filter on field row)</h2>
	{#if proposalsQuery.isLoading}
		<p>Loading…</p>
	{:else}
		<ul class="collection-rows">
			{#each proposalsQuery.data ?? [] as { row } (String(row[entityCollectionRow.idKey]))}
				<li>
					<pre class="collection-row-json">{jsonForDisplay(row)}</pre>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<section data-card>
	<h2>Joined query: Voltaire hierarchy (network → block → transactions → receipts)</h2>
	<p>
		RPC:
		<code>{rpcUrl}</code>
		— set
		<code>PUBLIC_ETH_RPC_URL</code>
		to override.
	</p>
	{#if chainQuery.isLoading}
		<p>Loading…</p>
	{:else}
		<ul>
			{#each chainQuery.data ?? [] as chainSummary (chainSummary.txHash)}
				<li>
					chain
					{chainSummary.chainId}
					— block
					{chainSummary.blockNumber}
					— tx
					{chainSummary.txHash}
					— value
					{chainSummary.txValue}
					— status
					{chainSummary.status}
					— gasUsed
					{chainSummary.gasUsed}
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.schema-entity {
		margin-bottom: 0.75rem;
		border: 1px solid color-mix(in srgb, currentColor 16%, transparent);
		border-radius: 0.35rem;
		padding: 0.35rem 0.5rem;
	}

	.schema-id-line {
		margin: 0.35rem 0 0.25rem 0;
	}

	.schema-field-list,
	.schema-pipeline-list {
		margin: 0.35rem 0 0.5rem 0;
		padding-left: 1.25rem;
		list-style: disc;
	}

	.collection-overview-lead {
		margin-bottom: 1rem;
	}

	.collection-domain {
		margin-bottom: 0.75rem;
		border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
		border-radius: 0.35rem;
		padding: 0.35rem 0.5rem;
	}

	.collection-field {
		margin: 0.5rem 0 0.25rem 0.75rem;
		border: 1px dashed color-mix(in srgb, currentColor 14%, transparent);
		border-radius: 0.25rem;
		padding: 0.25rem 0.4rem;
	}

	.collection-rows {
		margin: 0.35rem 0 0.5rem 0;
		padding-left: 1.1rem;
		list-style: disc;
	}

	.collection-row-json {
		margin: 0.25rem 0;
		padding: 0.35rem 0.5rem;
		overflow-x: auto;
		font-size: 0.8rem;
		line-height: 1.35;
		white-space: pre-wrap;
		word-break: break-word;
		background: color-mix(in srgb, currentColor 6%, transparent);
		border-radius: 0.25rem;
	}
</style>
