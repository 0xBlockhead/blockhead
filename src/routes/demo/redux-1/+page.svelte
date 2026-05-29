<script module lang="ts">
	import type { JsonValue } from '$/typescript/JsonValue.ts'
	import type { Type } from 'arktype'
	import type { ObjectType } from 'arktype/internal/variants/object.ts'
	import { regex } from 'arkregex'

	enum EntityFieldType {
		Primitive = 'Primitive',
		EntityReference = 'EntityReference',
		EntitiesReference = 'EntitiesReference',
	}

	enum EntityFieldCardinality {
		Zero = 'Zero',
		One = 'One',
		ZeroOrOne = 'ZeroOrOne',
		Many = 'Many',
		ZeroOrMany = 'ZeroOrMany',
	}

	type EntityFieldDefinitionTemplate = (
		| {
			name: string
			type: EntityFieldType.Primitive
			primitiveType: Type
			cardinality: EntityFieldCardinality.One | EntityFieldCardinality.ZeroOrOne | EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
			/** @deprecated */
			defaultSources?: Source[]
		}
		| {
			name: `$${string}`
			type: EntityFieldType.EntityReference
			entityType: string
			cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.One | EntityFieldCardinality.ZeroOrOne
			/** @deprecated */
			defaultSources?: Source[]
		}
		| {
			name: `$$${string}`
			type: EntityFieldType.EntitiesReference
			entityType: string
			cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
			/** @deprecated */
			defaultSources?: Source[]
		}
	)

	type EntityDefinitionTemplate = {
		readonly entityType: string
		readonly label: string
		readonly labelPlural: string
		readonly id: ObjectType<any, any>
		readonly fields: readonly EntityFieldDefinitionTemplate[]
	}

	type Schema = readonly EntityDefinitionTemplate[]

	type EntityType<_Schema extends Schema> = _Schema[number]['entityType']

	type EntityDefinitionForEntityType<
		_Schema extends Schema,
		_EntityType extends EntityType<_Schema>,
	> = Extract<_Schema[number], { entityType: _EntityType }>

	type EntityId<
		_Schema extends Schema,
		_EntityType extends EntityType<_Schema>,
	> = EntityDefinitionForEntityType<_Schema, _EntityType>['id']['infer']

	type EntityFieldName<
		_Schema extends Schema,
		_EntityType extends EntityType<_Schema>,
	> = EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number]['name']

	type EntityFieldDefinition<
		_Schema extends Schema,
		_EntityType extends EntityType<_Schema>,
		_FieldName extends EntityFieldName<_Schema, _EntityType>,
	> = Extract<EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number], { name: _FieldName }>

	type EntityFieldValue<
		_Schema extends Schema,
		_EntityType extends EntityType<_Schema>,
		_FieldName extends EntityFieldName<_Schema, _EntityType>,
	> = (
		EntityFieldDefinition<_Schema, _EntityType, _FieldName> extends infer _FieldDefinition extends EntityFieldDefinitionTemplate ?
			EntityFieldValueFromDefinition<_Schema, _FieldDefinition>
		:
			never
	)

	type EntityFieldValueFromDefinition<
		_Schema extends Schema,
		_EntityFieldDefinition extends _Schema[number]['fields'][number],
	> = (
		_EntityFieldDefinition extends {
			type: EntityFieldType.Primitive
			primitiveType: infer _PrimitiveType extends Type<any, any>
		} ?
			{
				[EntityFieldCardinality.Zero]: undefined
				[EntityFieldCardinality.ZeroOrOne]: _PrimitiveType['infer'] | undefined
				[EntityFieldCardinality.One]: _PrimitiveType['infer']
				[EntityFieldCardinality.Many]: _PrimitiveType['infer'][]
				[EntityFieldCardinality.ZeroOrMany]: _PrimitiveType['infer'][] | undefined
			}[_EntityFieldDefinition['cardinality']]

		: _EntityFieldDefinition extends {
			type: EntityFieldType.EntityReference
			entityType: infer _EntityType extends EntityType<_Schema>
		} ?
			{
				[EntityFieldCardinality.Zero]: undefined
				[EntityFieldCardinality.ZeroOrOne]: Entity<_Schema, _EntityType> | undefined
				[EntityFieldCardinality.One]: Entity<_Schema, _EntityType>
			}[_EntityFieldDefinition['cardinality']]

		: _EntityFieldDefinition extends {
			type: EntityFieldType.EntitiesReference
			entityType: infer _EntityType extends EntityType<_Schema>
		} ?
			{
				[EntityFieldCardinality.Zero]: undefined
				[EntityFieldCardinality.Many]: Entity<_Schema, _EntityType>[]
				[EntityFieldCardinality.ZeroOrMany]: Entity<_Schema, _EntityType>[] | undefined
			}[_EntityFieldDefinition['cardinality']]

		:
			never
	)

	type EntityFieldValues<
		_Schema extends Schema,
		_EntityType extends EntityType<_Schema>,
	> = (
		& {
			[
				_FieldDefinition in EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number] as (
					_FieldDefinition extends {
						cardinality: EntityFieldCardinality.One | EntityFieldCardinality.Many
					} ?
						_FieldDefinition['name']
					:
						never
				)
			]: EntityFieldValueFromDefinition<_Schema, _FieldDefinition>
		}
		& {
			[
				_FieldDefinition in EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number] as (
					_FieldDefinition extends {
						cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.ZeroOrOne | EntityFieldCardinality.ZeroOrMany
					} ?
						_FieldDefinition['name']
					:
						never
				)
			]?: EntityFieldValueFromDefinition<_Schema, _FieldDefinition>
		}
	)

	enum EntityMetaKey {
		ParentId = '#parentId',
		ParentIdKey = '#parentIdKey',
		Id = '#id',
		IdKey = '#idKey',
		Source = '#source',
		Fields = '#fields',
		Value = '#value',
	}

	// ---

	type Entity<
		_Schema extends Schema,
		_EntityType extends EntityType<_Schema>,
	> = {
		[EntityMetaKey.Id]: EntityId<_Schema, _EntityType>
		[EntityMetaKey.Fields]?: Partial<EntityFieldValues<_Schema, _EntityType>>
	}

	type EntityResolver<
		_Schema extends Schema,
		out _EntityType extends EntityType<_Schema>,
	> = {
		entityType: _EntityType
		source: Source
		resolve: (
			entityId: EntityId<_Schema, _EntityType>,
			context?: ReturnType<typeof parseLoadSubsetOptions>,
		) => Promise<Partial<EntityFieldValues<_Schema, _EntityType>>>
	}

	const defineEntityResolver = <_EntityType extends EntityType<typeof schema>>(
		entityResolver: EntityResolver<typeof schema, _EntityType>,
	) => entityResolver

	type EntityFieldResolver<
		_Schema extends Schema,
		out _EntityType extends EntityType<_Schema>,
		_ResolverFieldKey extends string = string,
	> = {
		entityType: _EntityType
		fieldName: _ResolverFieldKey
		source: Source
		resolve: (
			scopedEntityId: EntityId<_Schema, _EntityType>,
			context?: ReturnType<typeof parseLoadSubsetOptions>,
		) => Promise<EntityFieldValue<_Schema, _EntityType, _ResolverFieldKey>>
	}

	const defineEntityFieldResolver = <
		_EntityType extends EntityType<typeof schema>,
		_ResolverFieldKey extends string,
	>(
		entityFieldResolver: EntityFieldResolver<typeof schema, _EntityType, _ResolverFieldKey>,
	) => entityFieldResolver

	type EntityCollectionItem<
		_Schema extends Schema,
		_EntityType extends EntityType<_Schema>,
	> = {
		[EntityMetaKey.Id]: EntityId<_Schema, _EntityType>
		[EntityMetaKey.IdKey]: string
		[EntityMetaKey.Fields]: Partial<EntityFieldValues<_Schema, _EntityType>>

		[EntityMetaKey.Source]: Source
	}

	type EntityFieldCollectionItem<
		_Schema extends Schema,
		_ParentEntityType extends EntityType<_Schema>,
		_EntityFieldName extends EntityFieldName<_Schema, _ParentEntityType>,
	> = {
		[EntityMetaKey.ParentId]: EntityId<_Schema, _ParentEntityType>
		[EntityMetaKey.ParentIdKey]: string

		[EntityMetaKey.Value]: EntityFieldValue<_Schema, _ParentEntityType, _EntityFieldName>

		[EntityMetaKey.Source]: Source
	}

	// ---

	import type { QueryClient } from '@tanstack/query-core'
	import { queryCollectionOptions } from '@tanstack/query-db-collection'
		import {
			and,
			BasicIndex,
			createCollection,
			eq,
		parseLoadSubsetOptions,
		toArray,
	} from '@tanstack/svelte-db'
	import { stringify, parse } from 'devalue'

	const createEntityCollection = <
		_Schema extends Schema,
		_EntityType extends EntityType<_Schema>,
	>({
		entityDefinitionByType,
		entityResolversByEntityType,
		entityType,
		queryClient,
	}: {
		entityDefinitionByType: { [_EntityType in EntityType<_Schema>]?: EntityDefinitionForEntityType<_Schema, _EntityType> }
		entityResolversByEntityType: { [_EntityType in EntityType<_Schema>]?: EntityResolver<_Schema, _EntityType>[] }
		entityType: _EntityType
		queryClient: QueryClient
	}) => {
		const collection = createCollection(
			queryCollectionOptions<EntityCollectionItem<_Schema, _EntityType>>({
				id: `EntityCollection:${entityType}`,

				queryKey: [`EntityCollection:${entityType}`],

				syncMode: 'on-demand',

				autoIndex: 'eager',
				defaultIndexType: BasicIndex,

				queryFn: async ({ meta }) => {
					const loadSubsetOptions = meta?.loadSubsetOptions

					const { filters, sorts, limit } = parseLoadSubsetOptions(loadSubsetOptions)

					const sourceCandidates = (
						filters
							.filter((clause) => (
								clause.field[clause.field.length - 1] === EntityMetaKey.Source
								&& clause.operator === 'in'
							))
							.flatMap((clause) => (
								Array.isArray(clause.value) ?
									clause.value
								:
									[clause.value]
							))
					)
					const sources = new Set(
						sourceCandidates.filter((v): v is Source => (
							v === Source.Local_Internal
							|| v === Source.Voltaire_JsonRpc
							|| v === Source.Chainlist_Rest
							|| v === Source.EthereumEips_Github
						)),
					)

					const entityIds = (
						filters
							.filter((clause) => (
								clause.field[clause.field.length - 1] === EntityMetaKey.IdKey
								&& (clause.operator === 'eq' || clause.operator === 'in')
							))
							.flatMap((clause) => (
								clause.operator === 'eq' ?
									[clause.value]
								: Array.isArray(clause.value) ?
									clause.value
								:
									[clause.value]
							))
							.map((value) => (
								(
									typeof value === 'string' ?
										parse(value)
									:
										value
								) satisfies EntityId<_Schema, _EntityType>
							))
					)

					return (
						await Promise.all(
							entityIds.map(async (entityId) => (
								Promise.all(
									(
										(
											sources.size ?
												entityResolversByEntityType[entityType]
													?.filter((entityResolver) => sources.has(entityResolver.source))
											:
												entityResolversByEntityType[entityType]
										)
											?? []
									)
										.map(async (entityResolver) => {
											const fields = await entityResolver.resolve(
												entityId,
												{ filters, sorts, limit },
											)

											return (
												{
													[EntityMetaKey.Id]: entityId,
													[EntityMetaKey.IdKey]: stringify(entityId),
													[EntityMetaKey.Source]: entityResolver.source,
													[EntityMetaKey.Fields]: fields,
													...(
														fields !== undefined && typeof fields === 'object' && !Array.isArray(fields) ?
															fields
														:
															{}
													),
												} satisfies EntityCollectionItem<_Schema, _EntityType>
											)
										})
								)
							)),
						)
					)
						.flat()
				},

				getKey: entityItem => (
					[
						entityItem[EntityMetaKey.Source],
						entityItem[EntityMetaKey.IdKey]
					]
						.join('\0')
				),

				queryClient,
			}),
		)

		collection.createIndex(
			(entityItem) => entityItem[EntityMetaKey.IdKey],
			{ name: `${collection.id}:idKey` },
		)

		collection.createIndex(
			(entityItem) => entityItem[EntityMetaKey.Source],
			{ name: `${collection.id}:source` },
		)

		return collection
	}

	const createEntityFieldCollection = <
		_Schema extends Schema,
		_EntityType extends EntityType<_Schema>,
		_FieldDefinition extends EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number],
	>({
		entityFieldResolversByEntityTypeAndFieldName,
		entityType,
		fieldDefinition,
		queryClient,
	}: {
		entityFieldResolversByEntityTypeAndFieldName: {
			[_ResolvedEntityType in EntityType<_Schema>]: {
				[_ResolvedFieldName in EntityFieldName<_Schema, _ResolvedEntityType>]: EntityFieldResolver<
					_Schema,
					_ResolvedEntityType,
					_ResolvedFieldName
				>[]
			}
		}
		entityType: _EntityType
		fieldDefinition: _FieldDefinition
		queryClient: QueryClient
	}) => {
		const collection = createCollection(
			queryCollectionOptions<EntityFieldCollectionItem<_Schema, _EntityType, _FieldDefinition['name']>>({
				id: `EntityFieldCollection:${entityType}:${fieldDefinition.name}`,

				queryKey: [`EntityFieldCollection:${entityType}`, fieldDefinition.name],

				syncMode: 'on-demand',

				autoIndex: 'eager',
				defaultIndexType: BasicIndex,

				queryFn: async ({ meta }) => {
					const loadSubsetOptions = meta?.loadSubsetOptions

					const { filters, sorts, limit } = parseLoadSubsetOptions(loadSubsetOptions)

					const parentEntityIds = (
						[
							...filters
								.filter((c) => String(c.field[c.field.length - 1] ?? '') === EntityMetaKey.ParentIdKey)
								.filter((c) => c.operator === 'eq')
								.map((c) => c.value),
							...filters
								.filter((c) => String(c.field[c.field.length - 1] ?? '') === EntityMetaKey.ParentIdKey)
								.filter((c) => c.operator === 'in')
								.flatMap((c) => (
									Array.isArray(c.value) ?
										c.value
									:
										[c.value]
								)),
						]
							.map((value) => (
								(
									typeof value === 'string' ?
										parse(value)
									:
										value
								) satisfies EntityId<_Schema, _EntityType>
							))
					)

					const resolve = async (parentEntityId: EntityId<_Schema, _EntityType>) => {
						const entityFieldResolvers = entityFieldResolversByEntityTypeAndFieldName[entityType][fieldDefinition.name] ?? []

						const resultsPromise = Promise.allSettled(
							entityFieldResolvers
								.map(async fieldResolver => {
									const value = await fieldResolver.resolve(
										parentEntityId,
										{ filters, sorts, limit },
									)

									return (
										fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrMany || fieldDefinition.cardinality === EntityFieldCardinality.Many ?
											value.map(value => ({
												[EntityMetaKey.ParentId]: parentEntityId,
												[EntityMetaKey.ParentIdKey]: stringify(parentEntityId),
												[EntityMetaKey.Source]: fieldResolver.source,
												[EntityMetaKey.Value]: (
													fieldDefinition.type === EntityFieldType.EntityReference || fieldDefinition.type === EntityFieldType.EntitiesReference ?
														{
															...value,
															[EntityMetaKey.IdKey]: stringify(value[EntityMetaKey.Id]),
														}
													:
														value
												),
											}))
										: value === undefined ?
											[]
										:
											[
												{
													[EntityMetaKey.ParentId]: parentEntityId,
													[EntityMetaKey.ParentIdKey]: stringify(parentEntityId),
													[EntityMetaKey.Source]: fieldResolver.source,
													[EntityMetaKey.Value]: (
														fieldDefinition.type === EntityFieldType.EntityReference || fieldDefinition.type === EntityFieldType.EntitiesReference ?
															{
																...value,
																[EntityMetaKey.IdKey]: stringify(value[EntityMetaKey.Id]),
															}
														:
															value
													),
												},
											]
									)
								})
						)

						const results = (
							(await resultsPromise)
								.filter(result => result.status === 'fulfilled')
								.flatMap(result => result.value)
						)

						return results
					}

					const fieldQueryResult = (
						(
							await Promise.all(
								parentEntityIds
									.map(resolve)
							)
						)
							.flat()
					)

					return fieldQueryResult
				},

				getKey: entityFieldItem => (
					[
						entityFieldItem[EntityMetaKey.Source],
						entityFieldItem[EntityMetaKey.ParentIdKey],
						entityFieldItem[EntityMetaKey.Value][EntityMetaKey.IdKey],
					]
						.join('\0')
				),

				queryClient,
			}),
		)

		collection.createIndex(
			(entityFieldItem) => entityFieldItem[EntityMetaKey.ParentIdKey],
			{ name: `${collection.id}:parentIdKey` },
		)

		collection.createIndex(
			(entityFieldItem) => entityFieldItem[EntityMetaKey.Source],
			{ name: `${collection.id}:source` },
		)

		return collection
	}

	// ---

	enum BlockheadEntityType {
		_Global = '_Global',
		Actor = 'Actor',
		ActorCoin = 'ActorCoin',
		ActorCoinAllowance = 'ActorCoinAllowance',
		ActorNetwork = 'ActorNetwork',
		BeaconAction = 'BeaconAction',
		BeaconEpoch = 'BeaconEpoch',
		BeaconQueue = 'BeaconQueue',
		BeaconSlot = 'BeaconSlot',
		BeaconValidator = 'BeaconValidator',
		BlockheadAgentConversation = 'BlockheadAgentConversation',
		BlockheadAgentConversationTurn = 'BlockheadAgentConversationTurn',
		BlockheadEntityCollection = 'BlockheadEntityCollection',
		BlockheadFarcasterAccountConnection = 'BlockheadFarcasterAccountConnection',
		BlockheadPanelTree = 'BlockheadPanelTree',
		BlockheadRoom = 'BlockheadRoom',
		BlockheadRoomPeer = 'BlockheadRoomPeer',
		BlockheadSession = 'BlockheadSession',
		BlockheadSessionSimulation = 'BlockheadSessionSimulation',
		BlockheadSharedAddress = 'BlockheadSharedAddress',
		BlockheadSiweChallenge = 'BlockheadSiweChallenge',
		BlockheadSocialPostSession = 'BlockheadSocialPostSession',
		BlockheadSource = 'BlockheadSource',
		BlockheadTransferRequest = 'BlockheadTransferRequest',
		BlockheadWallet = 'BlockheadWallet',
		BlockheadWalletConnection = 'BlockheadWalletConnection',
		BridgeRoute = 'BridgeRoute',
		BridgeRouteStep = 'BridgeRouteStep',
		BridgeTransaction = 'BridgeTransaction',
		CctpAllowance = 'CctpAllowance',
		CctpFee = 'CctpFee',
		ChannelProposal = 'ChannelProposal',
		Coin = 'Coin',
		CoinInstance = 'CoinInstance',
		MarketPrice = 'MarketPrice',
		Market_TimeInterval_Timestamp = 'Market_TimeInterval_Timestamp',
		Eip8004Service = 'Eip8004Service',
		EnsName = 'EnsName',
		EvmBlock = 'EvmBlock',
		EvmCalldata = 'EvmCalldata',
		EvmContract = 'EvmContract',
		EvmContractCompilation = 'EvmContractCompilation',
		EvmContractSourceBundle = 'EvmContractSourceBundle',
		EvmContractVerification = 'EvmContractVerification',
		EvmError = 'EvmError',
		EvmMempool = 'EvmMempool',
		EvmSelector = 'EvmSelector',
		EvmTopic = 'EvmTopic',
		EvmTransaction = 'EvmTransaction',
		FarcasterCast = 'FarcasterCast',
		FarcasterCastEmbed = 'FarcasterCastEmbed',
		FarcasterChannel = 'FarcasterChannel',
		FarcasterFeed = 'FarcasterFeed',
		FarcasterNetwork = 'FarcasterNetwork',
		FarcasterUser = 'FarcasterUser',
		Leverage = 'Leverage',
		LiquidityPool = 'LiquidityPool',
		LiquidityPosition = 'LiquidityPosition',
		Media = 'Media',
		MediaObject = 'MediaObject',
		Network = 'Network',
		Proposal = 'Proposal',
		StateChannel = 'StateChannel',
		StateChannelDeposit = 'StateChannelDeposit',
		StateChannelState = 'StateChannelState',
		StateChannelTransfer = 'StateChannelTransfer',
		SwapQuote = 'SwapQuote',
		Vault = 'Vault',
		XmtpConversation = 'XmtpConversation',
	}

	enum Source {
		Local_Internal = 'Local_Internal',
		Voltaire_JsonRpc = 'Voltaire_JsonRpc',
		Chainlist_Rest = 'Chainlist_Rest',
		EthereumEips_Github = 'EthereumEips_Github',
	}

	export enum SpecificationRealm {
		ChainAgnostic = 'ChainAgnostic',
		Ethereum = 'Ethereum',
		Ens = 'Ens',
	}

	export enum ProposalCategory {
		Eip = 'Eip',
		Erc = 'Erc',
		Ensip = 'Ensip',
	}

	import { type } from 'arktype'

	const schema = [
		{
			entityType: BlockheadEntityType._Global,
			label: 'Global',
			labelPlural: 'Globals',
			id: type({}),
			fields: [
				{
					name: '$$proposals',
					type: EntityFieldType.EntitiesReference,
					entityType: BlockheadEntityType.SpecificationProposal,
					cardinality: EntityFieldCardinality.Many,
					defaultSources: [
						Source.EthereumEips_Github,
					],
				},
				{
					name: '$$networks',
					type: EntityFieldType.EntitiesReference,
					entityType: BlockheadEntityType.EvmNetwork,
					cardinality: EntityFieldCardinality.Many,
					defaultSources: [
						Source.Chainlist_Rest,
					],
				},
			],
		},

		{
			entityType: BlockheadEntityType.SpecificationProposal,
			label: 'Proposal',
			labelPlural: 'Proposals',
			id: type({
				realm: type.valueOf(SpecificationRealm),
				category: type.valueOf(ProposalCategory),
				proposalId: 'string',
			}),
			fields: [
				{
					name: 'eip',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.One,
				},
				{
					name: 'documentTitle',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.One,
				},
				{
					name: 'description',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.One,
				},
				{
					name: 'author',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.One,
				},
				{
					name: 'discussionsTo',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.One,
				},
				{
					name: 'status',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.One,
				},
				{
					name: 'type',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.One,
				},
				{
					name: 'documentCategory',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.One,
				},
				{
					name: 'created',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.One,
				},
				{
					name: 'requires',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.One,
				},
				{
					name: 'withdrawalReason',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.One,
				},
				{
					name: 'reviewPeriodEnd',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.One,
				},
				{
					name: 'lastCallDeadline',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.One,
				},
				{
					name: 'license',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.One,
				},
				{
					name: 'supersededBy',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.One,
				},
				{
					name: 'documentBody',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.One,
					defaultSources: [
						Source.EthereumEips_Github,
					],
				},
			],
		},

		{
			entityType: BlockheadEntityType.EvmNetwork,
			label: 'Network',
			labelPlural: 'Networks',
			id: type({
				chainId: 'number',
			}),
			fields: [
				{
					name: 'name',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
				{
					name: '$$blocks',
					type: EntityFieldType.EntitiesReference,
					entityType: BlockheadEntityType.EvmBlock,
					cardinality: EntityFieldCardinality.ZeroOrMany,
					defaultSources: [
						Source.Voltaire_JsonRpc,
					],
				},
			],
		},

		{
			entityType: BlockheadEntityType.EvmBlock,
			label: 'EVM Block',
			labelPlural: 'EVM Blocks',
			id: type({
				$network: type({
					chainId: 'number',
				}),
				blockNumber: 'bigint',
				'hash?': 'string',
			}),
			fields: [
				{
					name: 'timestamp',
					type: EntityFieldType.Primitive,
					primitiveType: type('number'),
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
				{
					name: 'gasUsed',
					type: EntityFieldType.Primitive,
					primitiveType: type('bigint'),
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
				{
					name: 'gasLimit',
					type: EntityFieldType.Primitive,
					primitiveType: type('bigint'),
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
				{
					name: '$$transactions',
					type: EntityFieldType.EntitiesReference,
					entityType: BlockheadEntityType.EvmTransaction,
					cardinality: EntityFieldCardinality.ZeroOrMany,
					defaultSources: [
						Source.Voltaire_JsonRpc,
					],
				},
			],
		},

		{
			entityType: BlockheadEntityType.EvmTransaction,
			label: 'EVM Transaction',
			labelPlural: 'EVM Transactions',
			id: type({
				$network: {
					chainId: 'number',
				},
				txHash: 'string',
			}),
			fields: [
				{
					name: 'value',
					type: EntityFieldType.Primitive,
					primitiveType: type('bigint'),
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
				{
					name: 'gas',
					type: EntityFieldType.Primitive,
					primitiveType: type('bigint'),
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
				{
					name: 'nonce',
					type: EntityFieldType.Primitive,
					primitiveType: type('number'),
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
				{
					name: 'status',
					type: EntityFieldType.Primitive,
					primitiveType: type('number'),
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
				{
					name: 'gasUsed',
					type: EntityFieldType.Primitive,
					primitiveType: type('bigint'),
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
			],
		},
	] as const satisfies Schema

	const entityDefinitionByType = Object.fromEntries(
		schema.map((definition) => [
			definition.entityType,
			definition,
		])
	)

	// const rowKeyEqValue = (
	// 	filters: { field: readonly unknown[]; operator: string; value?: JsonValue }[],
	// 	rowKey: string,
	// ) =>
	// 	filters.find(
	// 		(filterRow) =>
	// 			filterRow.operator === 'eq' &&
	// 			(
	// 				filterRow.field.map(String).join('.') === rowKey ||
	// 				(
	// 					filterRow.field.length > 0 &&
	// 					String(filterRow.field[filterRow.field.length - 1]) === rowKey
	// 				)
	// 			),
	// 	)?.value


	const demoRpcUrl = (
		(
			import.meta.env.PUBLIC_ETH_RPC_URL !== undefined &&
			String(import.meta.env.PUBLIC_ETH_RPC_URL).length > 0
		) ?
			String(import.meta.env.PUBLIC_ETH_RPC_URL)
		:	'https://ethereum.publicnode.com'
	)

	const entityResolvers = [
		defineEntityResolver({
			entityType: BlockheadEntityType._Global,
			source: Source.Local_Internal,
			resolve: async () => ({}),
		}),

		defineEntityResolver({
			entityType: BlockheadEntityType.EvmNetwork,
			source: Source.Voltaire_JsonRpc,
			resolve: async (_entityId) => (
				{
					name: 'Ethereum',
				}
			),
		}),

		defineEntityResolver({
			entityType: BlockheadEntityType.EvmNetwork,
			source: Source.Chainlist_Rest,
			resolve: async (entityId) => {
				const { fetchRpcsJson } = await import(
					'$/sources/Chainlist/Rest/queries.ts'
				)
				const chains = await fetchRpcsJson()
				const chain = chains.find((candidate) => candidate.chainId === entityId.chainId)
				return (
					chain === undefined ?
						{}
					:
						{
							[EntityMetaKey.Id]: {
								chainId: chain.chainId,
							},
							name: chain.title ?? chain.name,
						}
				)
			},
		}),

		defineEntityResolver({
			entityType: BlockheadEntityType.EvmBlock,
			source: Source.Voltaire_JsonRpc,
			resolve: async ($id) => {
				if (typeof $id.blockNumber !== 'bigint' === 'object' && $id.blockNumber !== 'bigint' !== null && !Array.isArray($id.blockNumber !== 'bigint')) return {}
				const { Rpc } = await import('@tevm/voltaire/jsonrpc')
				const { Hex } = await import('@tevm/voltaire/Hex')
				const { HttpProvider } = await import('@tevm/voltaire/provider')
				const blockJson = await new HttpProvider(demoRpcUrl).request(
					Rpc.Eth.GetBlockByNumberRequest(
						Hex.fromBigInt($id.blockNumber),
						false,
					),
				)
				const bj: Record<string, JsonValue> = (typeof blockJson === 'object' && blockJson !== null && !Array.isArray(blockJson)) ? blockJson : {}
				const tsRaw = bj['timestamp']
				const gasUsedRaw = bj['gasUsed']
				const gasLimitRaw = bj['gasLimit']
				return {
					number: $id.blockNumber,
					timestamp: (
						typeof tsRaw === 'string' ?
							Number.parseInt(tsRaw, 16)
						:	typeof tsRaw === 'number' ?
							tsRaw
						:
							undefined
					),
					gasUsed: (
						typeof gasUsedRaw === 'string' ?
							BigInt(gasUsedRaw)
						:
							undefined
					),
					gasLimit: (
						typeof gasLimitRaw === 'string' ?
							BigInt(gasLimitRaw)
						:
							undefined
					),
				}
			},
		}),

		defineEntityResolver({
			entityType: BlockheadEntityType.EvmTransaction,
			source: Source.Voltaire_JsonRpc,
			resolve: async ($id) => {
				if (
					typeof $id.txHash !== 'string' ||
					!$id.txHash.startsWith('0x')
				) {
					return {}
				}
				const { Rpc } = await import('@tevm/voltaire/jsonrpc')
				const { HttpProvider } = await import('@tevm/voltaire/provider')
				const transactionJsonRaw = await new HttpProvider(demoRpcUrl).request(
					Rpc.Eth.GetTransactionByHashRequest($id.txHash),
				)
				const transactionJson = (
					transactionJsonRaw == null ?
						null
					: (typeof transactionJsonRaw === 'object' && transactionJsonRaw !== null && !Array.isArray(transactionJsonRaw)) ?
						transactionJsonRaw
					: null
				)
				return {
					value: typeof transactionJson?.value === 'string' ?
						BigInt(transactionJson.value)
					:	0n,
					gas: typeof transactionJson?.gas === 'string' ?
						BigInt(transactionJson.gas)
					:	undefined,
					nonce: typeof transactionJson?.nonce === 'string' ?
						Number.parseInt(transactionJson.nonce, 16)
					:	undefined,
				}
			},
		}),

		defineEntityResolver({
			entityType: BlockheadEntityType.SpecificationProposal,
			source: Source.EthereumEips_Github,
			resolve: async ($id) => {
				const { getText } = await import('$/lib/http.ts')

				const markdownText = (
					(await getText(`https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/${$id.proposalId}.md`))
						.replace(/^\ufeff/, '')
						.replace(/\r\n/g, '\n')
				)

				const match = regex(
					'^s*(---s*\n(?<frontmatterText>[sS]*?)\n---s*\n?)?(?<bodyText>[sS]*)',
				).exec(markdownText)

				const frontmatterText = match?.groups?.frontmatterText ?? ''

				const frontmatter = Object.fromEntries(
					frontmatterText
						.split('\n')
						.map((line) => line.trim())
						.filter((line) => line !== '' && !line.startsWith('#'))
						.map((line) => {
							const colon = line.indexOf(':')
							if (colon < 0) return null
							const key = line.slice(0, colon).trim().toLowerCase()
							const val = line
								.slice(colon + 1)
								.trim()
								.replace(/^['"]|['"]$/g, '')
							return key !== '' ? [key, val] : null
						})
						.filter((entry): entry is [string, string] => entry !== undefined),
				)

				return {
					eip: frontmatter.eip ?? '',
					documentTitle: frontmatter.title ?? '',
					description: frontmatter.description ?? '',
					author: frontmatter.author ?? '',
					discussionsTo: frontmatter['discussions-to'] ?? '',
					status: frontmatter.status ?? '',
					type: frontmatter.type ?? '',
					documentCategory: frontmatter.category ?? '',
					created: frontmatter.created ?? '',
					requires: frontmatter.requires ?? '',
					withdrawalReason: frontmatter['withdrawal-reason'] ?? '',
					reviewPeriodEnd: frontmatter['review-period-end'] ?? '',
					lastCallDeadline: frontmatter['last-call-deadline'] ?? '',
					license: frontmatter.license ?? '',
					supersededBy: frontmatter['superseded-by'] ?? '',
				}
			},
		}),
	] as const

	const entityFieldResolvers = [
		defineEntityFieldResolver({
			entityType: BlockheadEntityType._Global,
			fieldName: '$$proposals',
			source: Source.EthereumEips_Github,
			resolve: async () => {
				const { getJson } = await import('$/lib/http.ts')
				const { restHeaders } = await import('$/sources/Github/Rest/constants.ts')
				const directory = await getJson<
					{ name: string; type: string; download_url: string | null }[]
				>(
					'https://api.github.com/repos/ethereum/EIPs/contents/EIPS?ref=master',
					{
						headers: { ...restHeaders },
					},
				)

				return (
					directory
						.map(({ name, type, download_url }) => (
							{
								[EntityMetaKey.Id]: {
									realm: SpecificationRealm.Ethereum,
									category: ProposalCategory.Eip,
									proposalId: regex('^(?<proposalId>.*).md$').exec(name)?.groups?.proposalId ?? name,
								},
							}
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: BlockheadEntityType._Global,
			fieldName: '$$networks',
			source: Source.Chainlist_Rest,
			resolve: async () => {
				const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
				const chains = await fetchRpcsJson()
				return (
					chains.map((chain) => (
						{
							[EntityMetaKey.Id]: {
								chainId: chain.chainId,
							},
						}
					))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: BlockheadEntityType.EvmNetwork,
			fieldName: '$$blocks',
			source: Source.Voltaire_JsonRpc,
			resolve: async (entityId) => {
				const chainId = entityId.chainId
				const { Rpc } = await import('@tevm/voltaire/jsonrpc')
				const { Hex } = await import('@tevm/voltaire/Hex')
				const { HttpProvider } = await import('@tevm/voltaire/provider')
				const rpcProvider = new HttpProvider(demoRpcUrl)
				const chainHeadWire = await rpcProvider.request(
					Rpc.Eth.BlockNumberRequest(),
				)
				const chainHead = BigInt(
					typeof chainHeadWire === 'string' ?
						chainHeadWire
					:	String(chainHeadWire),
				)
				const headBlockJsonRaw = await rpcProvider.request(
					Rpc.Eth.GetBlockByNumberRequest(
						Hex.fromBigInt(chainHead),
						false,
					),
				)
				const headBlockJson = (
					headBlockJsonRaw == null ?
						null
					: (typeof headBlockJsonRaw === 'object' && headBlockJsonRaw !== null && !Array.isArray(headBlockJsonRaw)) ?
						headBlockJsonRaw
					: null
				)
				return [
					{
						[EntityMetaKey.Id]: {
							$network: {
								chainId,
							},
							blockNumber: chainHead,
						},
						number: chainHead,
						hash: (
							typeof headBlockJson?.hash === 'string' ?
								headBlockJson.hash
							:
								undefined
						),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: BlockheadEntityType.EvmBlock,
			fieldName: '$$transactions',
			source: Source.Voltaire_JsonRpc,
			resolve: async ($id) => {
				if (typeof $id.blockNumber !== 'bigint' === 'object' && $id.blockNumber !== 'bigint' !== null && !Array.isArray($id.blockNumber !== 'bigint')) return []
				const chainId = Number($id.$network.caip2.reference)
				const { Rpc } = await import('@tevm/voltaire/jsonrpc')
				const { Hex } = await import('@tevm/voltaire/Hex')
				const { HttpProvider } = await import('@tevm/voltaire/provider')
				const blockRecord = await new HttpProvider(demoRpcUrl).request(
					Rpc.Eth.GetBlockByNumberRequest(
						Hex.fromBigInt($id.blockNumber),
						true,
					),
				)
				const blockWire = (
					blockRecord == null ?
						null
					: (typeof blockRecord === 'object' && blockRecord !== null && !Array.isArray(blockRecord)) ?
						blockRecord
					: null
				)
				const transactions: JsonValue[] = (
					blockWire !== undefined &&
					Array.isArray(blockWire.transactions) ?
						blockWire.transactions
					:	[]
				)
				const hashes: string[] = []
				const cap = 8
				for (const txOrHashInBlock of transactions) {
					if (hashes.length >= cap) break
					if (
						typeof txOrHashInBlock === 'string' &&
						txOrHashInBlock.startsWith('0x')
					) {
						hashes.push(txOrHashInBlock)
						continue
					}
					if ((typeof txOrHashInBlock === 'object' && txOrHashInBlock !== null && !Array.isArray(txOrHashInBlock))) {
						const hash = txOrHashInBlock['hash']
						if (typeof hash === 'string' && hash.startsWith('0x')) {
							hashes.push(hash)
						}
					}
				}
				return hashes.map((txHash) => ({
					[EntityMetaKey.Id]: {
						$network: {
							caip2: {
								namespace: 'eip155',
								reference: String(chainId),
							},
						},
						txHash,
					},
				}))
			},
		}),

		defineEntityFieldResolver({
			entityType: BlockheadEntityType.EvmTransaction,
			fieldName: 'status',
			source: Source.Voltaire_JsonRpc,
			resolve: async ($id) => {
				if (
					typeof $id.txHash !== 'string' ||
					!$id.txHash.startsWith('0x')
				) {
					return undefined
				}
				const { Rpc } = await import('@tevm/voltaire/jsonrpc')
				const { HttpProvider } = await import('@tevm/voltaire/provider')
				const receipt = await new HttpProvider(demoRpcUrl).request(
					Rpc.Eth.GetTransactionReceiptRequest(
						$id.txHash,
					),
				)
				const receiptWire = (
					receipt == null ?
						null
					: (typeof receipt === 'object' && receipt !== null && !Array.isArray(receipt)) ?
						receipt
					: null
				)
				return (
					typeof receiptWire?.status === 'string' ?
						Number.parseInt(receiptWire.status, 16)
					:
						undefined
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: BlockheadEntityType.EvmTransaction,
			fieldName: 'gasUsed',
			source: Source.Voltaire_JsonRpc,
			resolve: async ($id) => {
				if (
					typeof $id.txHash !== 'string' ||
					!$id.txHash.startsWith('0x')
				) {
					return undefined
				}
				const { Rpc } = await import('@tevm/voltaire/jsonrpc')
				const { HttpProvider } = await import('@tevm/voltaire/provider')
				const receipt = await new HttpProvider(demoRpcUrl).request(
					Rpc.Eth.GetTransactionReceiptRequest(
						$id.txHash,
					),
				)
				const receiptWire = (
					receipt == null ?
						null
					: (typeof receipt === 'object' && receipt !== null && !Array.isArray(receipt)) ?
						receipt
					: null
				)
				return (
					typeof receiptWire?.gasUsed === 'string' ?
						BigInt(receiptWire.gasUsed)
					:
						undefined
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: BlockheadEntityType.SpecificationProposal,
			fieldName: 'documentBody',
			source: Source.EthereumEips_Github,
			resolve: async ($id) => {
				const { getText } = await import('$/lib/http.ts')

				const markdownUrl = (
					$id.category === ProposalCategory.Erc ?
						(
							`https://raw.githubusercontent.com/ethereum/ercs/master/ERCS/${$id.proposalId}.md`
						)
					: $id.category === ProposalCategory.Eip ?
						(
							`https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/${$id.proposalId}.md`
						)
					:
						undefined
				)

				if(!markdownUrl) throw new Error('Unsupported proposal category')

				const markdown = await getText(markdownUrl)
				return (
					markdown
						.replace(/^\ufeff/, '')
						.replace(/\r\n/g, '\n')
						.replace(/^\s*---\s*\n[\s\S]*?\n---\s*\n?/, '')
						.trim()
				)
			},
		}),
	] as const

	const entityResolversByEntityType = Object.groupBy(
		entityResolvers,
		(entityResolver) => entityResolver.entityType,
	)

	const entityResolversByEntityTypeAndSource = Object.fromEntries(
		Object.entries(entityResolversByEntityType)
			.map(([entityType, entityResolvers]) => [
				entityType,
				Object.groupBy(
					entityResolvers,
					entityResolver => entityResolver.source,
				),
			]),
	)

	const entityFieldResolversByEntityType = Object.groupBy(
		entityFieldResolvers,
		(fieldResolver) => fieldResolver.entityType,
	)

	const sourcesByEntityType = Object.fromEntries(
		Object.entries(entityFieldResolversByEntityType).map(
			([entityType, entityFieldResolvers]) => [
				entityType,
				new Set(entityFieldResolvers.map((row) => row.source))
			],
		),
	)

	const entityFieldResolversByEntityTypeAndFieldName = Object.fromEntries(
		Object.entries(entityFieldResolversByEntityType)
			.map(([entityType, entityFieldResolvers]) => [
				entityType,
				Object.groupBy(
					entityFieldResolvers,
					fieldResolver => fieldResolver.fieldName,
				),
			]),
	)
</script>


<script lang="ts">
	// Types/constants
	import { QueryClient as _QueryClient } from '@tanstack/query-core'

	import {
		useLiveQuery,
	} from '@tanstack/svelte-db'

	type OneOffLiveQueryShell = { data: JsonValue; isLoading: boolean; isError: boolean }


	// Functions
	const liveQueryDataRows = (data: JsonValue) => (data === undefined ? [] : Array.isArray(data) ? data : [data])


	// State
	const queryClient = new _QueryClient()

	const entityCollectionByEntityType = Object.fromEntries(
		schema.map((definition) => [
			definition.entityType,
			createEntityCollection({
				entityDefinitionByType,
				entityResolversByEntityType,
				entityType: definition.entityType,
				queryClient,
			}),
		] as const)
	)

	const entityFieldCollections = Object.fromEntries(
		schema.map((definition) => [
			definition.entityType,
			Object.fromEntries(
				definition.fields.map((fieldDefinition) => [
					fieldDefinition.name,
					createEntityFieldCollection({
						entityFieldResolversByEntityTypeAndFieldName,
						entityType: definition.entityType,
						fieldDefinition,
						queryClient,
					}),
				] as const)
			),
		] as const),
	)

	const entityQueryByEntityType = Object.fromEntries(
		schema
			.map((entityDefinition) => [
				entityDefinition.entityType,
				useLiveQuery((queryBuilder) => (
					queryBuilder
						.from({ entity: entityCollectionByEntityType[entityDefinition.entityType] })
						.select(({ entity }) => ({ entity }))
				))
			] as const)
	)

	const entityFieldQueryByEntityType = Object.fromEntries(
		schema.map((entityDefinition) => [
			entityDefinition.entityType,
			Object.fromEntries(
				entityDefinition.fields
					.filter((field) => entityFieldCollections[entityDefinition.entityType][field.name])
					.map((field) => [
						field.name,
						useLiveQuery((queryBuilder) => (
							queryBuilder
								.from({
									entityField: entityFieldCollections[entityDefinition.entityType][field.name],
								})
								.select(({ entityField }) => ({ entityField }))
						)),
					] as const)
			)
		] as const)
	)

	const proposalsNestedQuery = useLiveQuery(
		queryBuilder => (
			queryBuilder
				.from({ global: entityCollectionByEntityType[BlockheadEntityType._Global] })
				.where(({ global }) => (
					eq(
						global[EntityMetaKey.IdKey],
						stringify({}),
					)
				))
				.select(({ global }) => ({
					$$proposals: toArray(
						queryBuilder.from({ $proposal: entityFieldCollections[BlockheadEntityType._Global]['$$proposals'] })
							.where(({ $proposal }) => (
								eq(
									global[EntityMetaKey.IdKey],
									$proposal[EntityMetaKey.ParentIdKey],
								)
							))
							.where(({ $proposal }) => (
								eq(
									$proposal[EntityMetaKey.Source],
									Source.EthereumEips_Github,
								)
							))
							.join(
								{ proposal: entityCollectionByEntityType[BlockheadEntityType.SpecificationProposal] },
								({ $proposal, proposal }) => (
									eq(
										$proposal[EntityMetaKey.Value][EntityMetaKey.IdKey],
										proposal[EntityMetaKey.IdKey],
									)
								)
							)
							.select(({ proposal }) => ({
								[EntityMetaKey.Id]: proposal[EntityMetaKey.Id],
								eip: proposal.eip,
								description: proposal.description,
								author: proposal.author,
								discussionsTo: proposal.discussionsTo,
								status: proposal.status,
								type: proposal.type,
								documentCategory: proposal.documentCategory,
								created: proposal.created,
								requires: proposal.requires,
								withdrawalReason: proposal.withdrawalReason,
								reviewPeriodEnd: proposal.reviewPeriodEnd,
								lastCallDeadline: proposal.lastCallDeadline,
								license: proposal.license,
								supersededBy: proposal.supersededBy,
								documentTitle: [],
								documentBody: [],
							}))
					),
				}))
				.findOne()
				// .innerJoin(
				// 	{
				// 		proposals: entityFieldCollections[BlockheadEntityType._Global]['$$proposals'],
				// 	},
				// 	({ global, proposal }) => (
				// 		eq(
				// 			global[EntityMetaKey.IdKey],
				// 			proposal[EntityMetaKey.IdKey],
				// 		)
				// 	),
				// )
				// .where(({ proposal }) => (
				// 	and(
				// 		eq(proposal.realm, proposalEntityId.realm),
				// 		eq(proposal.kind, proposalEntityId.kind),
				// 		eq(proposal.number, proposalEntityId.number),
				// 	)
				// ))
				// .select(({ proposal }) => ({
				// 	proposal,
				// 	body: proposal.body,
				// }))
		),
	)

	const proposalsJoinedQuery: OneOffLiveQueryShell = {
		data: [],
		isError: false,
		isLoading: false,
	}

	const networkQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $network: entityFieldCollections[BlockheadEntityType._Global]['$$networks'] })
				.where(({ $network }) => (
					eq(
						$network[EntityMetaKey.ParentIdKey],
						stringify({}),
					)
				))
				.where(({ $network }) => (
					eq(
						$network[EntityMetaKey.Source],
						Source.Chainlist_Rest,
					)
				))
				.join(
					{ networkRow: entityCollectionByEntityType[BlockheadEntityType.EvmNetwork] },
					({ $network, networkRow }) => (
						eq(
							$network[EntityMetaKey.Value][EntityMetaKey.IdKey],
							networkRow[EntityMetaKey.IdKey],
						)
					)
				)
				.where(({ networkRow }) => (
					eq(
						networkRow[EntityMetaKey.Source],
						Source.Chainlist_Rest,
					)
				))
				.select(({ networkRow }) => ({
					[EntityMetaKey.Id]: networkRow[EntityMetaKey.Id],
					[EntityMetaKey.IdKey]: networkRow[EntityMetaKey.IdKey],
				}))
		),
	)

	const oneOffLiveQueries: readonly (
		| { id: string; label: string; query: OneOffLiveQueryShell }
		| { id: string; label: string; hook: string; commented: true }
	)[] = [
		// {
		// 	id: 'proposalsNested',
		// 	label: 'Global + nested $$proposals join/select (findOne)',
		// 	query: proposalsNestedQuery
		// },
		// {
		// 	id: 'proposalsJoined',
		// 	label: '$$proposals + proposal + title + body leftJoins',
		// 	query: proposalsJoinedQuery
		// },
		// {
		// 	id: 'networkQuery',
		// 	label: 'network → block → tx → receipts',
		// 	query: networkQuery,
		// },
	]


	// Components
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<main data-column>
	<section data-card>
		<h2>Collection contents (entities + entityFields)</h2>
		<p class="collection-overview-lead">
			Nested
			<code>details</code>
			per
			<code>schema</code>
			entry; field collections follow each definition’s
			<code>fields</code>
			.
		</p>

		{#each schema as entityDefinition}
			{@const entityQuery = entityQueryByEntityType[entityDefinition.entityType]}

			<details
				data-card
				class="collection-domain"
			>
				<summary>
					<h2>
						<code>{entityDefinition.entityType}</code>
					</h2>

					{entityDefinition.label} entity collection
				</summary>

				<div data-column>
					<details
						data-card
						class="collection-domain"
					>
						<summary>
							<h3>
								Items
								{#if entityQuery.data?.length}(<NumberValue
									value={entityQuery.data.length}
									options={{ maximumFractionDigits: 0 }}
								/>){/if}
							</h3>
						</summary>

						{#if entityQuery.isLoading}
							<p>Loading…</p>
						{:else if entityQuery.isError}
							<p>Error</p>
						{:else if entityQuery.data.length}
							<ul class="collection-entities">
									{#each entityQuery.data as entityRow}
									<li>
										<pre data-card>{JSON.stringify(
											entityRow.entity,
											(_key, inner) => (typeof inner === 'bigint' ? inner.toString() : inner),
											2,
										)}</pre>
									</li>
								{/each}
							</ul>
						{:else}
							<p>No data</p>
						{/if}
					</details>

						{#each entityDefinition.fields as field}
							{@const entityFieldQuery = entityFieldQueryByEntityType[entityDefinition.entityType][field.name]}

							<details
							data-card
							class="collection-field"
						>
							<summary>
									<h4>
										<code>{field.name}</code>
										{#if entityFieldQuery != null && !entityFieldQuery.isLoading}
											(<NumberValue
												value={entityFieldQuery.data.length}
												options={{ maximumFractionDigits: 0 }}
										/>)
									{/if}
								</h4>
							</summary>

								<div data-column>
									{#if entityFieldQuery == null}
										<p>No collection</p>
									{:else if entityFieldQuery.isLoading}
										<p>Loading…</p>
								{:else if entityFieldQuery.isError}
									<p>Error</p>
								{:else if entityFieldQuery.data.length}
									<ul class="collection-entity-fields">
										{#each entityFieldQuery.data as fieldRow}
											<li>
												<pre data-card>{JSON.stringify(
													fieldRow.entityField,
													(_key, inner) => (typeof inner === 'bigint' ? inner.toString() : inner),
													2,
												)}</pre>
											</li>
										{/each}
									</ul>
								{:else}
									<p>No data</p>
								{/if}
							</div>
						</details>
					{/each}
				</div>
			</details>
		{/each}
	</section>

	<!-- <section data-card>
		<h2>One-off <code>useLiveQuery</code> results</h2>
		<p class="collection-overview-lead">
			Same rendering for every row: loading / error / <code>liveQueryDataRows(data)</code> → <code>#each</code> → <code>JSON.stringify</code>.
		</p>

			{#each oneOffLiveQueries as row}
			<details
				data-card
				class="collection-domain"
			>
				<summary>
					<h3>
						<code>{row.id}</code>
						{#if 'query' in row && !row.query.isLoading}
							({liveQueryDataRows(row.query.data).length})
						{/if}
					</h3>
					{row.label}
				</summary>

				<div data-column>
					{#if 'commented' in row}
						<p>
							Script hook <code>{row.hook}</code> is commented out (restore Network / EvmBlock / EvmTransaction schema and collections to enable). RPC would be <code>{demoRpcUrl}</code> (<code>PUBLIC_ETH_RPC_URL</code>).
						</p>
					{:else if row.query.isLoading}
						<p>Loading…</p>
					{:else if row.query.isError}
						<p>Error</p>
					{:else if liveQueryDataRows(row.query.data).length === 0}
						<p>No data</p>
					{:else}
						<ul class="collection-entity-fields">
							{#each liveQueryDataRows(row.query.data) as item}
								<li>
									<pre data-card>{stringify(item)}</pre>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</details>
		{/each}
	</section> -->
</main>


<style>
	/* .collection-overview-lead {
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

	.collection-entities,
	.collection-entity-fields {
		margin: 0.35rem 0 0.5rem 0;
		padding-left: 1.1rem;
	list-style: disc;
	} */

	pre {
		overflow-x: auto;
		font-size: 0.8rem;
		line-height: 1.35;
		/* white-space: pre-wrap;
		word-break: break-word; */
		/* max-width: 100%; */
		max-height: 80vh;
	}
</style>
