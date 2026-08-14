import { resolverContextRowLimit, type ResolverContext } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	networkByCaip2,
	networkBySlug,
	NetworkExecutionModel,
	NetworkLedgerModel,
} from '$/constants/Network.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import type {
	CosmosSdkAccount,
	CosmosSdkBlockResponse,
	CosmosSdkTx,
	CosmosSdkTxResponse,
	CosmosSdkTxsEventResponse,
} from '$/sources/CosmosSdk/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import { schema } from '$/schema/index.ts'
import { cosmosSdkRestEndpoints } from '$/sources/CosmosSdk/Rest/queries.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>


const assertCosmosHub = (network: NetworkId) => {
	if (
		(
			'slug' in network
			&& network.slug === networkBySlug.cosmos.slug
		)
		|| (
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.cosmos.caip2.namespace
			&& network.caip2.reference === networkBySlug.cosmos.caip2.reference
		)
	)
		return

	throw new Error('CosmosSdk_Rest: unsupported network')
}

const cosmosLatestBlockTimestampMs = (
	latestBlock: CosmosSdkBlockResponse
) => {
	const timestampMs = Date.parse(latestBlock.block.header.time)
	if (!Number.isFinite(timestampMs))
		throw new Error('CosmosSdk_Rest: latest block has an invalid timestamp')

	return timestampMs
}

const cosmosNetworkApplicability = [
	{
		caip2: networkBySlug.cosmos.caip2,
	},
	{
		slug: 'cosmos',
	},
] as const

const cosmosNetworkResolverSelectors = <_Snapshot extends object>(
	resolve: (
		network: NetworkId,
		context: ResolverContext
	) => Promise<_Snapshot>
) => ({
	Caip2: {
		appliesTo: [cosmosNetworkApplicability[0]],
		resolve,
	},
	Slug: {
		appliesTo: [cosmosNetworkApplicability[1]],
		resolve,
	},
})

const cosmosNetworkReferenceApplicability = [
	{
		$network: cosmosNetworkApplicability[0],
	},
	{
		$network: cosmosNetworkApplicability[1],
	},
] as const

const cosmosNetworkTimestampApplicability = [
	{
		...cosmosNetworkReferenceApplicability[0],
		source: Source.CosmosSdk_Rest,
	},
	{
		...cosmosNetworkReferenceApplicability[1],
		source: Source.CosmosSdk_Rest,
	},
] as const

const cosmosAccountTimestampApplicability = [
	{
		$account: cosmosNetworkReferenceApplicability[0],
		source: Source.CosmosSdk_Rest,
	},
	{
		$account: cosmosNetworkReferenceApplicability[1],
		source: Source.CosmosSdk_Rest,
	},
] as const

const cosmosValidatorTimestampApplicability = [
	{
		$validator: cosmosNetworkReferenceApplicability[0],
		source: Source.CosmosSdk_Rest,
	},
	{
		$validator: cosmosNetworkReferenceApplicability[1],
		source: Source.CosmosSdk_Rest,
	},
] as const

const cosmosTransactionReferenceApplicability = [
	{
		$transaction: cosmosNetworkReferenceApplicability[0],
	},
	{
		$transaction: cosmosNetworkReferenceApplicability[1],
	},
] as const

const cosmosPaginationCount = (
	total: string | undefined,
	label: string
) => {
	if (total == null)
		throw new Error(`CosmosSdk_Rest: ${label} pagination total missing`)

	const count = Number(total)
	if (!Number.isSafeInteger(count) || count < 0)
		throw new Error(`CosmosSdk_Rest: invalid ${label} pagination total ${total}`)

	return count
}

const cosmosUnsignedInteger = (
	value: string,
	label: string
) => {
	if (!/^(0|[1-9]\d*)$/.test(value))
		throw new Error(`CosmosSdk_Rest: invalid ${label} ${value}`)

	return BigInt(value)
}

const cosmosDurationToNs = (
	value: string,
	label: string
) => {
	const match = /^(0|[1-9]\d*)(?:\.(\d{1,9}))?s$/.exec(value)
	if (match == null)
		throw new Error(`CosmosSdk_Rest: invalid ${label} duration ${value}`)

	const wholeSeconds = BigInt(match[1])
	const decimalPointIndex = value.indexOf('.')
	const nanos = BigInt(
		decimalPointIndex === -1 ?
			'0'
		:
			value.slice(decimalPointIndex + 1, -1).padEnd(9, '0')
	)
	return wholeSeconds * 1_000_000_000n + nanos
}

const channelPartsFromPath = (
	path: string
) => {
	const hops = path.split('/')
	if (hops.length < 2 || hops.length % 2 !== 0)
		return

	const sourcePort = hops[hops.length - 2]
	const sourceChannel = hops[hops.length - 1]
	if (sourcePort === '' || sourceChannel === '')
		return

	return {
		sourcePort,
		sourceChannel,
	}
}

const cosmosIbcConnectionIdFromPath = (
	path: string
) => {
	if (path.startsWith('connections/')) {
		const connectionId = path.slice('connections/'.length)
		if (connectionId === '' || connectionId.includes('/'))
			throw new Error(`CosmosSdk_Rest: invalid IBC connection path ${path}`)

		return connectionId
	}

	if (path.includes('/'))
		throw new Error(`CosmosSdk_Rest: invalid IBC connection path ${path}`)

	return path
}

const cosmosCounterpartyNetworkReference = (
	counterpartyChainId: string
) => {
	const key = `cosmos:${counterpartyChainId}`
	if (!Object.hasOwn(networkByCaip2, key))
		return

	const catalog = networkByCaip2[key]
	if (!('caip2' in catalog))
		return

	return {
		[EntityMetaKey.Selector]: {
			caip2: catalog.caip2,
		},
	}
}

const cosmosIbcChannelListRows = (
	network: NetworkId,
	channels: {
		port_id?: string
		channel_id?: string
	}[]
) => (
	channels.map((channel) => {
		const portId = channel.port_id
		const channelId = channel.channel_id
		if (portId == null || portId === '' || channelId == null || channelId === '')
			throw new Error('CosmosSdk_Rest: IBC channel list row missing port or channel id')

		return {
			[EntityMetaKey.Selector]: {
				$network: network,
				portId,
				channelId,
			},
		}
	})
)

const cosmosValidatorFields = (validator: {
	operator_address?: string
	consensus_pubkey?: JsonValue
	description?: {
		moniker?: string
		identity?: string
		website?: string
		security_contact?: string
		details?: string
	}
	jailed: boolean
	status: string
	tokens: string
	delegator_shares?: string
	commission?: {
		commission_rates?: {
			rate?: string
			max_rate?: string
			max_change_rate?: string
		}
		update_time?: string
	}
	min_self_delegation?: string
	unbonding_height?: string
	unbonding_time?: string
}) => {
	// Transport leftovers: unbonding_height / unbonding_time / commission max_* —
	// unenrolled beside CosmosValidator identity + CosmosValidator_Timestamp commissionRate.
	if (validator.unbonding_height != null && !/^(0|[1-9]\d*)$/.test(validator.unbonding_height))
		throw new Error('CosmosSdk_Rest: malformed validator unbonding height')
	if (validator.commission?.commission_rates?.max_rate != null && validator.commission.commission_rates.max_rate === '')
		throw new Error('CosmosSdk_Rest: malformed validator max commission rate')
	if (validator.commission?.commission_rates?.max_change_rate != null && validator.commission.commission_rates.max_change_rate === '')
		throw new Error('CosmosSdk_Rest: malformed validator max change rate')

	const description = validator.description
	return {
		...(validator.consensus_pubkey != null && {
			consensusPubkey: JSON.stringify(validator.consensus_pubkey),
		}),
		...(description?.moniker != null && description.moniker !== '' && {
			moniker: description.moniker,
		}),
		...(description?.identity != null && description.identity !== '' && {
			identity: description.identity,
		}),
		...(description?.website != null && description.website !== '' && {
			website: description.website,
		}),
		...(description?.security_contact != null && description.security_contact !== '' && {
			securityContact: description.security_contact,
		}),
		...(description?.details != null && description.details !== '' && {
			details: description.details,
		}),
	}
}

const cosmosAccountBaseFields = (account: CosmosSdkAccount) => (
	account.base_account
	?? account.base_vesting_account?.base_account
	?? account
)

const cosmosAccountTimestampFields = (
	accountId: {
		$network: NetworkId
		address: string
	},
	account: CosmosSdkAccount | undefined,
	timestampMs: number
) => {
	const accountBaseFields = account == null ? undefined : cosmosAccountBaseFields(account)
	return {
		$account: {
			[EntityMetaKey.Selector]: accountId,
		},
		timestampMs,
		source: Source.CosmosSdk_Rest,
		...(accountBaseFields?.account_number != null && {
			accountNumber: BigInt(accountBaseFields.account_number),
		}),
		...(accountBaseFields?.sequence != null && {
			sequence: BigInt(accountBaseFields.sequence),
		}),
	}
}

const cosmosValidatorTimestampFields = (
	validatorId: {
		$network: NetworkId
		operatorAddress: string
	},
	validator: Parameters<typeof cosmosValidatorFields>[0],
	timestampMs: number
) => {
	const commissionRate = validator.commission?.commission_rates?.rate
	return {
		$validator: {
			[EntityMetaKey.Selector]: validatorId,
		},
		timestampMs,
		source: Source.CosmosSdk_Rest,
		jailed: validator.jailed,
		status: validator.status,
		tokens: BigInt(validator.tokens),
		...(validator.delegator_shares != null && validator.delegator_shares !== '' && {
			delegatorShares: validator.delegator_shares,
		}),
		...(commissionRate != null && commissionRate !== '' && {
			commissionRate,
		}),
		...(validator.min_self_delegation != null && {
			minSelfDelegation: BigInt(validator.min_self_delegation),
		}),
	}
}

const cosmosValidatorTimestampReference = (
	validatorId: {
		$network: NetworkId
		operatorAddress: string
	},
	validator: Parameters<typeof cosmosValidatorFields>[0],
	timestampMs: number
) => {
	const timestamp = cosmosValidatorTimestampFields(validatorId, validator, timestampMs)
	return {
		[EntityMetaKey.Selector]: {
			$validator: validatorId,
			timestampMs: timestamp.timestampMs,
			source: timestamp.source,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.CosmosValidator_Timestamp, [], '$validator')]: timestamp.$validator,
			[entityFieldAddressKey(EntityType.CosmosValidator_Timestamp, [], 'jailed')]: timestamp.jailed,
			[entityFieldAddressKey(EntityType.CosmosValidator_Timestamp, [], 'status')]: timestamp.status,
			[entityFieldAddressKey(EntityType.CosmosValidator_Timestamp, [], 'tokens')]: timestamp.tokens,
			...(timestamp.delegatorShares != null && {
				[entityFieldAddressKey(EntityType.CosmosValidator_Timestamp, [], 'delegatorShares')]: timestamp.delegatorShares,
			}),
			...(timestamp.commissionRate != null && {
				[entityFieldAddressKey(EntityType.CosmosValidator_Timestamp, [], 'commissionRate')]: timestamp.commissionRate,
			}),
			...(timestamp.minSelfDelegation != null && {
				[entityFieldAddressKey(EntityType.CosmosValidator_Timestamp, [], 'minSelfDelegation')]: timestamp.minSelfDelegation,
			}),
		},
	}
}

const cosmosProposalTimestampReference = (
	proposalId: {
		$network: NetworkId
		proposalId: string
	},
	proposal: {
		status: string
	},
	timestampMs: number
) => ({
	[EntityMetaKey.Selector]: {
		$proposal: proposalId,
		timestampMs,
		source: Source.CosmosSdk_Rest,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.CosmosGovernanceProposal_Timestamp, [], 'status')]: proposal.status,
	},
})

const cosmosMessageTypeLabels = (
	typeUrl: string
) => {
	const messageType = (
		typeUrl.startsWith('/') ?
			typeUrl.slice(1)
		:
			typeUrl
	)
	const segments = messageType.split('.')
	if (segments.length < 2)
		return {}

	const moduleName = segments[1]
	const messageName = segments.at(-1)
	if (messageName == null)
		return {}

	return {
		moduleName,
		messageName,
	}
}

const cosmosMessageEventTypes = (
	events: NonNullable<CosmosSdkTxResponse['tx_response']['events']>,
	indexInTransaction: number
) => [...new Set(
	events.flatMap((event) => {
		const messageIndex = event.attributes?.find((attribute) => attribute.key === 'msg_index')?.value
		if (messageIndex == null || messageIndex !== String(indexInTransaction))
			return []

		return [event.type]
	})
)]

const cosmosMessageTypeUrl = (
	message: NonNullable<NonNullable<CosmosSdkTx['body']>['messages']>[number],
	txHash: string,
	indexInTransaction: number
) => {
	const typeUrl = message['@type']
	if (typeUrl == null || typeUrl === '')
		throw new Error(`CosmosSdk_Rest: message @type is missing for ${txHash}:${indexInTransaction}`)

	return typeUrl
}

const cosmosMessageFields = (
	network: NetworkId,
	message: NonNullable<NonNullable<CosmosSdkTx['body']>['messages']>[number],
	txHash: string,
	indexInTransaction: number,
	wireTransaction?: CosmosSdkTxResponse
) => {
	const typeUrl = cosmosMessageTypeUrl(message, txHash, indexInTransaction)
	const {
		moduleName,
		messageName,
	} = cosmosMessageTypeLabels(typeUrl)
	const senderAddress = message.sender ?? message.from_address
	const signerAddress = message.signer ?? senderAddress
	return {
		typeUrl,
		...(moduleName != null && { moduleName }),
		...(messageName != null && { messageName }),
		...(signerAddress != null && {
			signerAddress,
			$signer: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: signerAddress,
				},
			},
		}),
		...(senderAddress != null && { senderAddress }),
		...(message.grantee != null && { granteeAddress: message.grantee }),
		...(message.granter != null && { granterAddress: message.granter }),
		...(message.contract != null && {
			contractAddress: message.contract,
			$contract: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: message.contract,
				},
			},
		}),
		...(message.funds != null && message.funds.length > 0 && {
			funds: message.funds.map((fund) => ({
				denom: fund.denom,
				amount: cosmosUnsignedInteger(fund.amount, 'message fund amount'),
			})),
		}),
		...(wireTransaction?.tx_response.events != null && {
			eventTypes: cosmosMessageEventTypes(
				wireTransaction.tx_response.events,
				indexInTransaction
			),
		}),
	}
}

const cosmosMessageRows = (
	entitySelector: {
		$network: NetworkId
		txHash: string
	},
	wireTransaction: CosmosSdkTxResponse
) => (
	(wireTransaction.tx?.body?.messages ?? []).map((message, indexInTransaction) => {
		const fields = cosmosMessageFields(
			entitySelector.$network,
			message,
			entitySelector.txHash,
			indexInTransaction,
			wireTransaction
		)
		return {
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				indexInTransaction,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.CosmosMessage, [], 'typeUrl')]: fields.typeUrl,
				...(fields.moduleName != null && {
					[entityFieldAddressKey(EntityType.CosmosMessage, [], 'moduleName')]: fields.moduleName,
				}),
				...(fields.messageName != null && {
					[entityFieldAddressKey(EntityType.CosmosMessage, [], 'messageName')]: fields.messageName,
				}),
				...(fields.signerAddress != null && {
					[entityFieldAddressKey(EntityType.CosmosMessage, [], 'signerAddress')]: fields.signerAddress,
				}),
				...(fields.senderAddress != null && {
					[entityFieldAddressKey(EntityType.CosmosMessage, [], 'senderAddress')]: fields.senderAddress,
				}),
				...(fields.granteeAddress != null && {
					[entityFieldAddressKey(EntityType.CosmosMessage, [], 'granteeAddress')]: fields.granteeAddress,
				}),
				...(fields.granterAddress != null && {
					[entityFieldAddressKey(EntityType.CosmosMessage, [], 'granterAddress')]: fields.granterAddress,
				}),
				...(fields.contractAddress != null && {
					[entityFieldAddressKey(EntityType.CosmosMessage, [], 'contractAddress')]: fields.contractAddress,
				}),
				...(fields.funds != null && {
					[entityFieldAddressKey(EntityType.CosmosMessage, [], 'funds')]: fields.funds,
				}),
				...(fields.eventTypes != null && {
					[entityFieldAddressKey(EntityType.CosmosMessage, [], 'eventTypes')]: fields.eventTypes,
				}),
				...(fields.$signer != null && {
					[entityFieldAddressKey(EntityType.CosmosMessage, [], '$signer')]: fields.$signer,
				}),
				...(fields.$contract != null && {
					[entityFieldAddressKey(EntityType.CosmosMessage, [], '$contract')]: fields.$contract,
				}),
			},
		}
	})
)

const cosmosTransactionFields = (
	entitySelector: {
		$network: NetworkId
		txHash: string
	},
	wireTransaction: CosmosSdkTxResponse
) => ({
	$block: {
		[EntityMetaKey.Selector]: {
			$network: entitySelector.$network,
			height: cosmosUnsignedInteger(wireTransaction.tx_response.height, 'transaction height'),
		},
	},
	code: wireTransaction.tx_response.code,
	...(wireTransaction.tx_response.codespace != null && {
		codespace: wireTransaction.tx_response.codespace,
	}),
	gasWanted: cosmosUnsignedInteger(wireTransaction.tx_response.gas_wanted, 'gas wanted'),
	gasUsed: cosmosUnsignedInteger(wireTransaction.tx_response.gas_used, 'gas used'),
	feeAmount: (wireTransaction.tx?.auth_info?.fee?.amount ?? []).map((amount) => ({
		denom: amount.denom,
		amount: cosmosUnsignedInteger(amount.amount, 'fee amount'),
	})),
	...(wireTransaction.tx?.auth_info?.fee?.gas_limit != null && {
		feeGasLimit: cosmosUnsignedInteger(wireTransaction.tx.auth_info.fee.gas_limit, 'fee gas limit'),
	}),
	...(wireTransaction.tx?.body?.memo != null && {
		memo: wireTransaction.tx.body.memo,
	}),
	...(wireTransaction.tx?.body?.timeout_height != null && {
		timeoutHeight: cosmosUnsignedInteger(wireTransaction.tx.body.timeout_height, 'timeout height'),
	}),
	signerAddresses: [...new Set(
		(wireTransaction.tx?.body?.messages ?? []).flatMap((message) => (
			(message.signer ?? message.sender ?? message.from_address) == null ?
				[]
			:
				[(message.signer ?? message.sender ?? message.from_address) ?? '']
		))
	)],
	signatures: wireTransaction.tx?.signatures ?? [],
	rawLog: wireTransaction.tx_response.raw_log,
	eventTypes: [...new Set(
		(wireTransaction.tx_response.events ?? []).map((event) => event.type)
	)],
	$$messages: cosmosMessageRows(entitySelector, wireTransaction),
})

const cosmosTransactionSearchResults = (
	response: CosmosSdkTxsEventResponse
) => {
	if (response.txs.length !== response.tx_responses.length)
		throw new Error('CosmosSdk_Rest: transaction search response arrays do not align')

	const total = Number(cosmosUnsignedInteger(response.total, 'transaction search total'))
	if (!Number.isSafeInteger(total) || total < 0)
		throw new Error(`CosmosSdk_Rest: invalid transaction search total ${response.total}`)

	const transactionHashes = new Set(response.tx_responses.map((transaction) => transaction.txhash))
	if (transactionHashes.size !== response.tx_responses.length || transactionHashes.has(''))
		throw new Error('CosmosSdk_Rest: transaction search response contains invalid duplicate identities')

	return {
		total,
		transactions: response.tx_responses.map((txResponse, index) => ({
			tx: response.txs[index],
			tx_response: txResponse,
		})),
	}
}

const getCosmosAccountSnapshot = async (
	network: NetworkId,
	limit: number
) => {
	assertCosmosHub(network)
	const { getAccounts } = await import('$/sources/CosmosSdk/Rest/queries.ts')
	const response = await getAccounts({
		limit,
	})
	const rows = response.accounts.flatMap((account) => {
		const address = cosmosAccountBaseFields(account).address
		return address == null ?
			[]
		:
			[address]
	})
	if (new Set(rows).size !== rows.length)
		throw new Error('CosmosSdk_Rest: account list contains duplicate identities')

	return {
		rows: rows.map((address) => ({
			[EntityMetaKey.Selector]: {
				$network: network,
				address,
			},
		})),
		totalCount: cosmosPaginationCount(response.pagination?.total, 'account'),
	}
}

const getCosmosValidatorSnapshot = async (
	network: NetworkId,
	limit: number
) => {
	assertCosmosHub(network)
	const { getValidators } = await import('$/sources/CosmosSdk/Rest/queries.ts')
	const response = await getValidators({
		limit,
	})
	const operatorAddresses = response.validators.map((validator) => validator.operator_address)
	if (new Set(operatorAddresses).size !== operatorAddresses.length)
		throw new Error('CosmosSdk_Rest: validator list contains duplicate identities')

	return {
		rows: operatorAddresses.map((operatorAddress) => ({
			[EntityMetaKey.Selector]: {
				$network: network,
				operatorAddress,
			},
		})),
		totalCount: cosmosPaginationCount(response.pagination?.total, 'validator'),
	}
}

const getCosmosProposalSnapshot = async (
	network: NetworkId,
	limit: number,
	paginationKey?: string
) => {
	assertCosmosHub(network)
	const { getProposals } = await import('$/sources/CosmosSdk/Rest/queries.ts')
	const response = await getProposals({
		limit,
		paginationKey,
	})
	const proposalIds = response.proposals.map((proposal) => proposal.id)
	if (new Set(proposalIds).size !== proposalIds.length)
		throw new Error('CosmosSdk_Rest: governance proposal list contains duplicate identities')
	if (response.pagination?.next_key === paginationKey)
		throw new Error('CosmosSdk_Rest: governance proposal continuation did not advance')

	return {
		rows: proposalIds.map((proposalId) => ({
			[EntityMetaKey.Selector]: {
				$network: network,
				proposalId,
			},
		})),
		nextPaginationKey: response.pagination?.next_key,
		totalCount: cosmosPaginationCount(response.pagination?.total, 'governance proposal'),
	}
}

const getCosmosBlockReferences = async (
	network: NetworkId,
	limit: number
) => {
	assertCosmosHub(network)
	const { getLatestBlock } = await import('$/sources/CosmosSdk/Rest/queries.ts')
	const latestBlock = await getLatestBlock()
	const latestBlockHeight = BigInt(latestBlock.block.header.height)
	return Array.from({
		length: Math.min(
			Number(latestBlockHeight + 1n),
			limit
		),
	}, (_value, blockOffset) => ({
		[EntityMetaKey.Selector]: {
			$network: network,
			height: latestBlockHeight - BigInt(blockOffset),
		},
	}))
}

export default {
	source: Source.CosmosSdk_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: cosmosNetworkResolverSelectors(
				async () => cosmosSdkRestEndpoints()
			),
		})({
				Cosmos: {
					restEndpoints: (restEndpoints) => restEndpoints,
				},
			}),

		defineResolver({
			entityType: EntityType.Network_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					appliesTo: cosmosNetworkTimestampApplicability,
					resolve: async ({
						$network,
						timestampMs,
						source,
					}) => {
						assertCosmosHub($network)
						if (source !== Source.CosmosSdk_Rest)
							throw new Error(`CosmosSdk_Rest: unsupported network timestamp source ${source}`)
						const {
							getLatestBlock,
							getNodeInfo,
							getStakingPool,
							getSyncing,
							getValidators,
						} = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const [
							latestBlock,
							nodeInfo,
							syncing,
							bondedValidators,
							stakingPool,
						] = await Promise.all([
							getLatestBlock(),
							getNodeInfo(),
							getSyncing(),
							getValidators({
								limit: 1,
								status: 'BOND_STATUS_BONDED',
							}),
							getStakingPool(),
						])
						const latestBlockTimestampMs = cosmosLatestBlockTimestampMs(latestBlock)
						if (latestBlockTimestampMs !== timestampMs)
							throw new Error('CosmosSdk_Rest: network observation clock mismatch')

						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							ledgerModels: [NetworkLedgerModel.Account],
							executionModels: [NetworkExecutionModel.CosmosSdk],
							latestBlockHeight: BigInt(latestBlock.block.header.height),
							latestBlockHash: latestBlock.block_id.hash,
							latestBlockTimeMs: latestBlockTimestampMs,
							latestBlockTransactionCount: latestBlock.block.data.txs?.length ?? 0,
							chainId: nodeInfo.default_node_info.network,
							nodeNetwork: nodeInfo.default_node_info.network,
							applicationName: nodeInfo.application_version?.app_name ?? nodeInfo.application_version?.name,
							applicationVersion: nodeInfo.application_version?.version,
							cosmosSdkVersion: nodeInfo.application_version?.cosmos_sdk_version,
							isSyncing: syncing.syncing,
							bondedValidatorCount: cosmosPaginationCount(bondedValidators.pagination?.total, 'bonded validator'),
							bondedTokens: BigInt(stakingPool.pool.bonded_tokens),
							notBondedTokens: BigInt(stakingPool.pool.not_bonded_tokens),
						}
					},
				}
			},
		})({
				$network: (timestamp) => timestamp.$network,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				ledgerModels: (timestamp) => timestamp.ledgerModels,
				executionModels: (timestamp) => timestamp.executionModels,
				Cosmos: {
					latestBlockHeight: (timestamp) => timestamp.latestBlockHeight,
					latestBlockHash: (timestamp) => timestamp.latestBlockHash,
					latestBlockTimeMs: (timestamp) => timestamp.latestBlockTimeMs,
					latestBlockTransactionCount: (timestamp) => timestamp.latestBlockTransactionCount,
					chainId: (timestamp) => timestamp.chainId,
					nodeNetwork: (timestamp) => timestamp.nodeNetwork,
					applicationName: (timestamp) => timestamp.applicationName,
					applicationVersion: (timestamp) => timestamp.applicationVersion,
					cosmosSdkVersion: (timestamp) => timestamp.cosmosSdkVersion,
					isSyncing: (timestamp) => timestamp.isSyncing,
					bondedValidatorCount: (timestamp) => timestamp.bondedValidatorCount,
					bondedTokens: (timestamp) => timestamp.bondedTokens,
					notBondedTokens: (timestamp) => timestamp.notBondedTokens,
				},
			}),

		defineResolver({
			entityType: EntityType.CosmosBlock,
			resolve: {
				NetworkHeight: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async ({ $network, height }) => {

						const { getBlock } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const wireBlock = await getBlock({
							height,
						})
						return {
							hash: wireBlock.block_id.hash,
							proposerConsensusAddress: wireBlock.block.header.proposer_address,
							timestampMs: Date.parse(wireBlock.block.header.time),
							transactionCount: wireBlock.block.data.txs?.length ?? 0,
						}
					},
				}
			},
		})({
				hash: (block) => block.hash,
				proposerConsensusAddress: (block) => block.proposerConsensusAddress,
				timestampMs: (block) => block.timestampMs,
				transactionCount: (block) => block.transactionCount,
			}),

		defineResolver({
			entityType: EntityType.CosmosTransaction,
			resolve: {
				NetworkTxHash: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async (entitySelector) => {
						assertCosmosHub(entitySelector.$network)

						const { getTx } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const wireTransaction = await getTx({
							txHash: entitySelector.txHash,
						})
						if (wireTransaction.tx_response.txhash !== entitySelector.txHash)
							throw new Error('CosmosSdk_Rest: transaction response does not match the subject')

						return cosmosTransactionFields(entitySelector, wireTransaction)
					},
				}
			},
		})({
				$block: (transaction) => transaction.$block,
				code: (transaction) => transaction.code,
				codespace: (transaction) => transaction.codespace,
				gasWanted: (transaction) => transaction.gasWanted,
				gasUsed: (transaction) => transaction.gasUsed,
				feeAmount: (transaction) => transaction.feeAmount,
				feeGasLimit: (transaction) => transaction.feeGasLimit,
				memo: (transaction) => transaction.memo,
				timeoutHeight: (transaction) => transaction.timeoutHeight,
				signerAddresses: (transaction) => transaction.signerAddresses,
				signatures: (transaction) => transaction.signatures,
				rawLog: (transaction) => transaction.rawLog,
				eventTypes: (transaction) => transaction.eventTypes,
				$$messages: (transaction) => transaction.$$messages,
			}),

		defineResolver({
			entityType: EntityType.CosmosAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async (entitySelector) => {
						const { $network, address } = entitySelector
						assertCosmosHub($network)

						const {
							getAccount,
							getLatestBlock,
						} = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const [
							{ account },
							latestBlock,
						] = await Promise.all([
							getAccount({
								address: address,
							}),
							getLatestBlock(),
						])
						if (account == null)
							throw new Error('CosmosSdk_Rest: account response is missing')

						if (cosmosAccountBaseFields(account).address !== address)
							throw new Error('CosmosSdk_Rest: account response does not match the subject')

						const timestampMs = cosmosLatestBlockTimestampMs(latestBlock)

						const timestamp = cosmosAccountTimestampFields(entitySelector, account, timestampMs)
						return {
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$account: entitySelector,
									timestampMs: timestamp.timestampMs,
									source: timestamp.source,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], '$account')]: timestamp.$account,
									...(timestamp.accountNumber != null && {
										[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], 'accountNumber')]: timestamp.accountNumber,
									}),
									...(timestamp.sequence != null && {
										[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], 'sequence')]: timestamp.sequence,
									}),
								},
							}],
						}
					},
				}
			},
		})({
				$$timestamps: (account) => account.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.CosmosAccount_Timestamp,
			resolve: {
				AccountTimestampMsSource: {
					appliesTo: cosmosAccountTimestampApplicability,
					resolve: async ({
						$account,
						timestampMs,
						source,
					}) => {
						assertCosmosHub($account.$network)
						if (source !== Source.CosmosSdk_Rest)
							throw new Error(`CosmosSdk_Rest: unsupported account timestamp source ${source}`)

						const {
							getAccount,
							getLatestBlock,
						} = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const [
							{ account },
							latestBlock,
						] = await Promise.all([
							getAccount({
								address: $account.address,
							}),
							getLatestBlock(),
						])
						if (account == null)
							throw new Error('CosmosSdk_Rest: account response is missing')

						if (cosmosAccountBaseFields(account).address !== $account.address)
							throw new Error('CosmosSdk_Rest: account response does not match the subject')
						if (cosmosLatestBlockTimestampMs(latestBlock) !== timestampMs)
							throw new Error('CosmosSdk_Rest: account observation clock mismatch')

						return cosmosAccountTimestampFields(
							$account,
							account,
							timestampMs
						)
					},
				},
			},
		})({
				$account: (account) => account.$account,
				timestampMs: (account) => account.timestampMs,
				source: (account) => account.source,
				accountNumber: (account) => account.accountNumber,
				sequence: (account) => account.sequence,
			}),

		defineResolver({
			entityType: EntityType.CosmosValidator,
			resolve: {
				NetworkOperatorAddress: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async (entitySelector) => {
						const { $network, operatorAddress } = entitySelector
						assertCosmosHub($network)
						const {
							getLatestBlock,
							getValidator,
						} = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const [
							latestBlock,
							{ validator },
						] = await Promise.all([
							getLatestBlock(),
							getValidator({
								operatorAddress: operatorAddress,
							}),
						])
						if (validator.operator_address !== operatorAddress)
							throw new Error('CosmosSdk_Rest: validator response does not match the subject')

						return {
							...cosmosValidatorFields(validator),
							$$timestamps: [
								cosmosValidatorTimestampReference(
									entitySelector,
									validator,
									cosmosLatestBlockTimestampMs(latestBlock)
								),
							],
						}
					},
				}
			},
		})({
				consensusPubkey: (validator) => validator.consensusPubkey,
				moniker: (validator) => validator.moniker,
				identity: (validator) => validator.identity,
				website: (validator) => validator.website,
				securityContact: (validator) => validator.securityContact,
				details: (validator) => validator.details,
				$$timestamps: (validator) => validator.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.CosmosValidator_Timestamp,
			resolve: {
				ValidatorTimestampMsSource: {
					appliesTo: cosmosValidatorTimestampApplicability,
					resolve: async ({
						$validator,
						timestampMs,
						source,
					}) => {
						assertCosmosHub($validator.$network)
						if (source !== Source.CosmosSdk_Rest)
							throw new Error(`CosmosSdk_Rest: unsupported validator timestamp source ${source}`)
						const {
							getLatestBlock,
							getValidator,
						} = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const [
							latestBlock,
							{ validator },
						] = await Promise.all([
							getLatestBlock(),
							getValidator({
								operatorAddress: $validator.operatorAddress,
							}),
						])
						if (validator.operator_address !== $validator.operatorAddress)
							throw new Error('CosmosSdk_Rest: validator response does not match the subject')
						if (cosmosLatestBlockTimestampMs(latestBlock) !== timestampMs)
							throw new Error('CosmosSdk_Rest: validator observation clock mismatch')

						return cosmosValidatorTimestampFields(
							$validator,
							validator,
							timestampMs
						)
					},
				},
			},
		})({
				$validator: (validator) => validator.$validator,
				timestampMs: (validator) => validator.timestampMs,
				source: (validator) => validator.source,
				jailed: (validator) => validator.jailed,
				status: (validator) => validator.status,
				tokens: (validator) => validator.tokens,
				delegatorShares: (validator) => validator.delegatorShares,
				commissionRate: (validator) => validator.commissionRate,
				minSelfDelegation: (validator) => validator.minSelfDelegation,
			}),

		defineResolver({
			entityType: EntityType.CosmosMessage,
			resolve: {
				TransactionIndexInTransaction: {
					appliesTo: cosmosTransactionReferenceApplicability,
					resolve: async ({ $transaction, indexInTransaction }) => {
						const { getTx } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const wireTransaction = await getTx({
							txHash: $transaction.txHash,
						})
						const message = wireTransaction.tx?.body?.messages?.at(indexInTransaction)
						if (message == null) throw new Error(`CosmosSdk_Rest: message not found for ${$transaction.txHash}:${indexInTransaction}`)
						return cosmosMessageFields(
							$transaction.$network,
							message,
							$transaction.txHash,
							indexInTransaction,
							wireTransaction
						)
					},
				}
			},
		})({
				typeUrl: (message) => message.typeUrl,
				moduleName: (message) => message.moduleName,
				messageName: (message) => message.messageName,
				signerAddress: (message) => message.signerAddress,
				senderAddress: (message) => message.senderAddress,
				granteeAddress: (message) => message.granteeAddress,
				granterAddress: (message) => message.granterAddress,
				contractAddress: (message) => message.contractAddress,
				funds: (message) => message.funds,
				eventTypes: (message) => message.eventTypes,
				$signer: (message) => message.$signer,
				$contract: (message) => message.$contract,
			}),

		defineResolver({
			entityType: EntityType.CosmosGovernanceProposal,
			resolve: {
				NetworkProposalId: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async (entitySelector) => {
						const { $network, proposalId } = entitySelector
						assertCosmosHub($network)
						const {
							getLatestBlock,
							getProposal,
						} = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const [
							latestBlock,
							{ proposal },
						] = await Promise.all([
							getLatestBlock(),
							getProposal({
								proposalId: proposalId,
							}),
						])
						if (proposal.id !== proposalId)
							throw new Error('CosmosSdk_Rest: governance proposal response does not match the subject')

						return {
							title: proposal.title,
							summary: proposal.summary,
							metadata: proposal.metadata,
							$$timestamps: [
								cosmosProposalTimestampReference(
									entitySelector,
									proposal,
									cosmosLatestBlockTimestampMs(latestBlock)
								),
							],
						}
					},
				}
			},
		})({
				title: (proposal) => proposal.title,
				summary: (proposal) => proposal.summary,
				metadata: (proposal) => proposal.metadata,
				$$timestamps: (proposal) => proposal.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.CosmosDenom,
			resolve: {
				NetworkDenom: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async ({ $network, denom }) => {
						const { getDenomMetadata } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const metadata = (await getDenomMetadata({
							denom: denom,
						})).metadata
						return {
							display: metadata.display,
							base: metadata.base,
							symbol: metadata.symbol,
						}
					},
				}
			},
		})({
				display: (denom) => denom.display,
				base: (denom) => denom.base,
				symbol: (denom) => denom.symbol,
			}),

		defineResolver({
			entityType: EntityType.CosmosModule,
			resolve: {
				NetworkModuleName: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async ({ $network, moduleName }) => {
						const { getModuleAccount } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const moduleAccount = await getModuleAccount({
							moduleName: moduleName,
						})
						return {
							...(moduleAccount.account?.base_account?.address != null && {
								$authority: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										address: moduleAccount.account.base_account.address,
									},
								},
							}),
						}
					},
				}
			},
		})({
				$authority: (module) => module.$authority,
			}),

		defineResolver({
			entityType: EntityType.CosmosContract,
			resolve: {
				NetworkAddress: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async ({ $network, address }) => {
						const { getContractInfo } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const contractInfo = (await getContractInfo({
							address: address,
						})).contract_info
						return {
							codeId: BigInt(contractInfo.code_id),
							$creator: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									address: contractInfo.creator,
								},
							},
							...(contractInfo.admin != null && {
								$admin: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										address: contractInfo.admin,
									},
								},
							}),
						}
					},
				}
			},
		})({
				codeId: (contract) => contract.codeId,
				$creator: (contract) => contract.$creator,
				$admin: (contract) => contract.$admin,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cosmosNetworkResolverSelectors(
				async (network) => {
					assertCosmosHub(network)
					const { getLatestBlock } = await import('$/sources/CosmosSdk/Rest/queries.ts')

					return [{
						[EntityMetaKey.Selector]: {
							$network: network,
							timestampMs: cosmosLatestBlockTimestampMs(await getLatestBlock()),
							source: Source.CosmosSdk_Rest,
						},
					}]
				}
			),
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cosmosNetworkResolverSelectors(
				async (network, context) => (
					getCosmosBlockReferences(
						network,
						resolverContextRowLimit(context)
					)
				)
			),
		})({
				Cosmos: {
					$$blocks: (blocks) => blocks,
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cosmosNetworkResolverSelectors(
				async (network, context) => (
					getCosmosAccountSnapshot(
						network,
						resolverContextRowLimit(context)
					)
				)
			),
		})({
				Cosmos: {
					$$accounts: {
						select: (snapshot) => snapshot.rows,
						resolveCount: (snapshot) => snapshot.totalCount,
					},
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cosmosNetworkResolverSelectors(
				async (network, context) => (
					getCosmosValidatorSnapshot(
						network,
						resolverContextRowLimit(context)
					)
				)
			),
		})({
				Cosmos: {
					$$validators: {
						select: (snapshot) => snapshot.rows,
						resolveCount: (snapshot) => snapshot.totalCount,
					},
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cosmosNetworkResolverSelectors(
				async (network, context) => (
					getCosmosProposalSnapshot(
						network,
						resolverContextRowLimit(context),
						context.providerContinuationToken
					)
				)
			),
		})({
				Cosmos: {
					$$governanceProposals: {
						select: (snapshot) => snapshot.rows,
						resolveCount: (snapshot) => snapshot.totalCount,
						continuation: (snapshot) => (
							snapshot.nextPaginationKey == null ?
								{
									operation: 'cosmos-governance-proposals',
									target: 'cosmos-sdk',
									terminal: true,
								}
							:
								{
									operation: 'cosmos-governance-proposals',
									target: 'cosmos-sdk',
									terminal: false,
									token: snapshot.nextPaginationKey,
								}
						),
					},
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cosmosNetworkResolverSelectors(
				async (network, context) => {
					assertCosmosHub(network)
					const {
						getIbcChannels,
					} = await import('$/sources/CosmosSdk/Rest/queries.ts')
					const response = await getIbcChannels({
						limit: resolverContextRowLimit(context),
					})
					return {
						rows: response.channels.map((channel) => {
							const portId = channel.port_id
							const channelId = channel.channel_id
							if (portId == null || portId === '' || channelId == null || channelId === '')
								throw new Error('CosmosSdk_Rest: IBC channel list row missing port or channel id')

							return {
								[EntityMetaKey.Selector]: {
									$network: network,
									portId,
									channelId,
								},
							}
						}),
						totalCount: cosmosPaginationCount(response.pagination?.total, 'IBC channel'),
					}
				}
			),
		})({
			Cosmos: {
				$$ibcChannels: {
					select: (snapshot) => snapshot.rows,
					resolveCount: (snapshot) => snapshot.totalCount,
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cosmosNetworkResolverSelectors(
				async (network, context) => {
					assertCosmosHub(network)
					const {
						getIbcClientStates,
					} = await import('$/sources/CosmosSdk/Rest/queries.ts')
					const response = await getIbcClientStates({
						limit: resolverContextRowLimit(context),
					})
					return {
						rows: response.client_states.map((client) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								clientId: client.client_id,
							},
						})),
						totalCount: cosmosPaginationCount(response.pagination?.total, 'IBC client'),
					}
				}
			),
		})({
			Cosmos: {
				$$ibcClients: {
					select: (snapshot) => snapshot.rows,
					resolveCount: (snapshot) => snapshot.totalCount,
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cosmosNetworkResolverSelectors(
				async (network, context) => {
					assertCosmosHub(network)
					const {
						getIbcConnections,
					} = await import('$/sources/CosmosSdk/Rest/queries.ts')
					const response = await getIbcConnections({
						limit: resolverContextRowLimit(context),
					})
					return {
						rows: response.connections.map((connection) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								connectionId: connection.id,
							},
						})),
						totalCount: cosmosPaginationCount(response.pagination?.total, 'IBC connection'),
					}
				}
			),
		})({
			Cosmos: {
				$$ibcConnections: {
					select: (snapshot) => snapshot.rows,
					resolveCount: (snapshot) => snapshot.totalCount,
				},
			},
		}),


		defineResolver({
			entityType: EntityType.CosmosAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async (cosmosAccount, context) => {
						assertCosmosHub(cosmosAccount.$network)
						const limit = resolverContextRowLimit(context)
						const offset = context.providerContinuationToken == null ?
							context.pagination.offset ?? 0
						:
							Number(context.providerContinuationToken)
						if (!Number.isSafeInteger(offset) || offset < 0)
							throw new Error('CosmosSdk_Rest: invalid account transaction continuation')

						const prefixLimit = offset + limit
						if (!Number.isSafeInteger(prefixLimit) || prefixLimit < 1)
							throw new Error('CosmosSdk_Rest: invalid account transaction limit')

						const { getTransactionsByEvent } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const [senderPage, recipientPage] = await Promise.all([
							getTransactionsByEvent({
								event: `message.sender='${cosmosAccount.address}'`,
								limit: prefixLimit,
							}),
							getTransactionsByEvent({
								event: `transfer.recipient='${cosmosAccount.address}'`,
								limit: prefixLimit,
							}),
						])
						const senderResults = cosmosTransactionSearchResults(senderPage)
						const recipientResults = cosmosTransactionSearchResults(recipientPage)
						const transactionByHash = new Map<string, CosmosSdkTxResponse>()
						for (const transaction of [
							...senderResults.transactions,
							...recipientResults.transactions,
						])
							if (!transactionByHash.has(transaction.tx_response.txhash))
								transactionByHash.set(transaction.tx_response.txhash, transaction)

						const transactions = [...transactionByHash.values()].toSorted((left, right) => {
							const leftHeight = cosmosUnsignedInteger(left.tx_response.height, 'transaction height')
							const rightHeight = cosmosUnsignedInteger(right.tx_response.height, 'transaction height')
							if (leftHeight !== rightHeight)
								return leftHeight < rightHeight ? 1 : -1

							return left.tx_response.txhash.localeCompare(right.tx_response.txhash)
						})
						return {
							limit,
							offset,
							terminal: (
								senderResults.total <= senderResults.transactions.length
								&& recipientResults.total <= recipientResults.transactions.length
								&& transactions.length <= prefixLimit
							),
							transactions: transactions.slice(offset, prefixLimit),
						}
					},
				},
			},
		})({
				$$transactions: {
					select: (page, cosmosAccount) => page.transactions.map((wireTransaction) => {
						const transactionSelector = {
							$network: cosmosAccount.$network,
							txHash: wireTransaction.tx_response.txhash,
						}
						const transaction = cosmosTransactionFields(
							transactionSelector,
							wireTransaction
						)
						return {
							[EntityMetaKey.Selector]: transactionSelector,
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'txHash')]: transactionSelector.txHash,
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], '$block')]: transaction.$block,
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'code')]: transaction.code,
								...(transaction.codespace != null && {
									[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'codespace')]: transaction.codespace,
								}),
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'gasWanted')]: transaction.gasWanted,
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'gasUsed')]: transaction.gasUsed,
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'feeAmount')]: transaction.feeAmount,
								...(transaction.feeGasLimit != null && {
									[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'feeGasLimit')]: transaction.feeGasLimit,
								}),
								...(transaction.memo != null && {
									[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'memo')]: transaction.memo,
								}),
								...(transaction.timeoutHeight != null && {
									[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'timeoutHeight')]: transaction.timeoutHeight,
								}),
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'signerAddresses')]: transaction.signerAddresses,
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'signatures')]: transaction.signatures,
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'rawLog')]: transaction.rawLog,
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'eventTypes')]: transaction.eventTypes,
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], '$$messages')]: transaction.$$messages,
							},
						}
					}),
					continuation: (page, cosmosAccount) => (
						page.terminal ?
							{
								operation: 'account-transactions',
								target: cosmosAccount.address,
								terminal: true,
							}
						:
							{
								operation: 'account-transactions',
								target: cosmosAccount.address,
								terminal: false,
								token: (page.offset + page.limit).toString(),
							}
					),
				},
			}),

		defineResolver({
			entityType: EntityType.IbcPacket,
			resolve: {
				ChannelSequenceDirection: {
					appliesTo: cosmosNetworkReferenceApplicability.map(($network) => ({
						$channel: $network,
					})),
					resolve: async ({
						$channel,
						sequence,
						direction,
					}) => {
						assertCosmosHub($channel.$network)
						if (direction === 'source') {
							const {
								getIbcPacketCommitment,
							} = await import('$/sources/CosmosSdk/Rest/queries.ts')
							const commitment = await getIbcPacketCommitment({
								portId: $channel.portId,
								channelId: $channel.channelId,
								sequence,
							})
							return {
								sourcePort: $channel.portId,
								sourceChannel: $channel.channelId,
								...(commitment.commitment !== '' && {
									commitmentHash: `base64:${commitment.commitment}`,
								}),
								status: (
									commitment.commitment === '' ?
										'commitment-absent'
									:
										'committed'
								),
							}
						}

						if (direction === 'destination') {
							const {
								getIbcPacketAcknowledgement,
								getIbcPacketReceipt,
							} = await import('$/sources/CosmosSdk/Rest/queries.ts')
							const [
								acknowledgement,
								receipt,
							] = await Promise.all([
								getIbcPacketAcknowledgement({
									portId: $channel.portId,
									channelId: $channel.channelId,
									sequence,
								}),
								getIbcPacketReceipt({
									portId: $channel.portId,
									channelId: $channel.channelId,
									sequence,
								}),
							])
							return {
								destinationPort: $channel.portId,
								destinationChannel: $channel.channelId,
								receiptExists: receipt.received,
								status: (
									acknowledgement.acknowledgement !== '' ?
										'acknowledgement-written'
									: receipt.received ?
										'received'
									:
										'not-received'
								),
							}
						}

						throw new Error(`CosmosSdk_Rest: invalid IBC packet direction ${direction}`)
					},
				},
			},
		})({
			sourcePort: (packet) => packet.sourcePort,
			sourceChannel: (packet) => packet.sourceChannel,
			destinationPort: (packet) => packet.destinationPort,
			destinationChannel: (packet) => packet.destinationChannel,
			commitmentHash: (packet) => packet.commitmentHash,
			receiptExists: (packet) => packet.receiptExists,
			status: (packet) => packet.status,
		}),

		defineResolver({
			entityType: EntityType.IbcChannel,
			resolve: {
				NetworkPortIdChannelId: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async ({
						$network,
						portId,
						channelId,
					}) => {
						assertCosmosHub($network)
						const {
							getIbcChannel,
							getIbcClientState,
							getIbcConnection,
							getIbcNextSequenceReceive,
							getIbcNextSequenceSend,
						} = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const {
							channel,
						} = await getIbcChannel({
							portId,
							channelId,
						})
						const connectionId = channel.connection_hops[0]
						if (connectionId === '')
							throw new Error('CosmosSdk_Rest: IBC channel missing connection hop')

						const [
							{
								connection,
							},
							nextSequenceSend,
							nextSequenceReceive,
						] = await Promise.all([
							getIbcConnection({
								connectionId,
							}),
							getIbcNextSequenceSend({
								portId,
								channelId,
							}),
							getIbcNextSequenceReceive({
								portId,
								channelId,
							}),
						])
						const {
							client_state: clientState,
						} = await getIbcClientState({
							clientId: connection.client_id,
						})
						const $counterpartyNetwork = cosmosCounterpartyNetworkReference(clientState.chain_id)

						return {
							$connection: {
								[EntityMetaKey.Selector]: {
									$network,
									connectionId,
								},
							},
							$client: {
								[EntityMetaKey.Selector]: {
									$network,
									clientId: connection.client_id,
								},
							},
							counterpartyChainId: clientState.chain_id,
							...($counterpartyNetwork != null && {
								$counterpartyNetwork,
							}),
							counterpartyPortId: channel.counterparty.port_id,
							counterpartyChannelId: channel.counterparty.channel_id,
							state: channel.state,
							ordering: channel.ordering,
							version: channel.version,
							nextSequenceSend: cosmosUnsignedInteger(
								nextSequenceSend.next_sequence_send,
								'next sequence send'
							),
							nextSequenceReceive: cosmosUnsignedInteger(
								nextSequenceReceive.next_sequence_receive,
								'next sequence receive'
							),
						}
					},
				},
			},
		})({
			$connection: (channel) => channel.$connection,
			$client: (channel) => channel.$client,
			counterpartyChainId: (channel) => channel.counterpartyChainId,
			$counterpartyNetwork: (channel) => channel.$counterpartyNetwork,
			counterpartyPortId: (channel) => channel.counterpartyPortId,
			counterpartyChannelId: (channel) => channel.counterpartyChannelId,
			state: (channel) => channel.state,
			ordering: (channel) => channel.ordering,
			version: (channel) => channel.version,
			nextSequenceSend: (channel) => channel.nextSequenceSend,
			nextSequenceReceive: (channel) => channel.nextSequenceReceive,
		}),

		defineResolver({
			entityType: EntityType.IbcConnection,
			resolve: {
				NetworkConnectionId: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async ({
						$network,
						connectionId,
					}, context) => {
						assertCosmosHub($network)
						const {
							getIbcConnectionChannels,
						} = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const response = await getIbcConnectionChannels({
							connectionId,
							limit: resolverContextRowLimit(context),
						})
						return {
							rows: cosmosIbcChannelListRows($network, response.channels),
							totalCount: cosmosPaginationCount(response.pagination?.total, 'IBC connection channel'),
						}
					},
				},
			},
		})({
			$$channels: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.totalCount,
			},
		}),

		defineResolver({
			entityType: EntityType.IbcConnection,
			resolve: {
				NetworkConnectionId: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async ({
						$network,
						connectionId,
					}) => {
						assertCosmosHub($network)
						const {
							getIbcConnection,
						} = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const {
							connection,
						} = await getIbcConnection({
							connectionId,
						})
						return {
							clientId: connection.client_id,
							$client: {
								[EntityMetaKey.Selector]: {
									$network,
									clientId: connection.client_id,
								},
							},
							counterpartyClientId: connection.counterparty.client_id,
							...(connection.counterparty.connection_id !== '' && {
								counterpartyConnectionId: connection.counterparty.connection_id,
							}),
							state: connection.state,
							delayPeriodNs: cosmosUnsignedInteger(
								connection.delay_period,
								'delay period'
							),
						}
					},
				},
			},
		})({
			clientId: (connection) => connection.clientId,
			$client: (connection) => connection.$client,
			counterpartyClientId: (connection) => connection.counterpartyClientId,
			counterpartyConnectionId: (connection) => connection.counterpartyConnectionId,
			state: (connection) => connection.state,
			delayPeriodNs: (connection) => connection.delayPeriodNs,
		}),

		defineResolver({
			entityType: EntityType.IbcClient,
			resolve: {
				NetworkClientId: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async ({
						$network,
						clientId,
					}) => {
						assertCosmosHub($network)
						const {
							getIbcClientConnections,
						} = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const {
							connection_paths: connectionPaths,
						} = await getIbcClientConnections({
							clientId,
						})
						return {
							rows: connectionPaths.map((path) => ({
								[EntityMetaKey.Selector]: {
									$network,
									connectionId: cosmosIbcConnectionIdFromPath(path),
								},
							})),
							totalCount: connectionPaths.length,
						}
					},
				},
			},
		})({
			$$connections: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.totalCount,
			},
		}),

		defineResolver({
			entityType: EntityType.IbcClient,
			resolve: {
				NetworkClientId: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async ({
						$network,
						clientId,
					}, context) => {
						assertCosmosHub($network)
						const {
							getIbcClientConnections,
							getIbcConnectionChannels,
						} = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const {
							connection_paths: connectionPaths,
						} = await getIbcClientConnections({
							clientId,
						})
						const limit = resolverContextRowLimit(context)
						const connectionIds = connectionPaths.map(cosmosIbcConnectionIdFromPath)
						const channelPages = await Promise.all(
							connectionIds.map((connectionId) => (
								getIbcConnectionChannels({
									connectionId,
									limit,
								})
							))
						)
						const rows = []
						for (const page of channelPages) {
							for (const row of cosmosIbcChannelListRows($network, page.channels)) {
								if (rows.length >= limit)
									break

								rows.push(row)
							}
							if (rows.length >= limit)
								break
						}
						return {
							rows,
							totalCount: channelPages.reduce(
								(sum, page) => (
									sum + cosmosPaginationCount(page.pagination?.total, 'IBC client channel')
								),
								0
							),
						}
					},
				},
			},
		})({
			$$channels: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.totalCount,
			},
		}),

		defineResolver({
			entityType: EntityType.IbcClient,
			resolve: {
				NetworkClientId: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async ({
						$network,
						clientId,
					}) => {
						assertCosmosHub($network)
						const {
							getIbcClientState,
						} = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const {
							client_state: clientState,
						} = await getIbcClientState({
							clientId,
						})
						const clientType = (
							clientState['@type'].includes('tendermint') ?
								'07-tendermint'
							:
								clientState['@type']
						)
						const $counterpartyNetwork = cosmosCounterpartyNetworkReference(clientState.chain_id)
						return {
							clientType,
							latestHeight: clientState.latest_height,
							frozenHeight: clientState.frozen_height,
							trustLevel: `${clientState.trust_level.numerator}/${clientState.trust_level.denominator}`,
							trustingPeriodNs: cosmosDurationToNs(
								clientState.trusting_period,
								'trusting period'
							),
							unbondingPeriodNs: cosmosDurationToNs(
								clientState.unbonding_period,
								'unbonding period'
							),
							maxClockDriftNs: cosmosDurationToNs(
								clientState.max_clock_drift,
								'max clock drift'
							),
							counterpartyChainId: clientState.chain_id,
							...($counterpartyNetwork != null && {
								$counterpartyNetwork,
							}),
						}
					},
				},
			},
		})({
			clientType: (client) => client.clientType,
			latestHeight: (client) => client.latestHeight,
			frozenHeight: (client) => client.frozenHeight,
			trustLevel: (client) => client.trustLevel,
			trustingPeriodNs: (client) => client.trustingPeriodNs,
			unbondingPeriodNs: (client) => client.unbondingPeriodNs,
			maxClockDriftNs: (client) => client.maxClockDriftNs,
			counterpartyChainId: (client) => client.counterpartyChainId,
			$counterpartyNetwork: (client) => client.$counterpartyNetwork,
		}),

		defineResolver({
			entityType: EntityType.IbcDenomTrace,
			resolve: {
				NetworkTraceKey: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async ({
						$network,
						traceKey,
					}) => {
						assertCosmosHub($network)
						if (traceKey.startsWith('trace:')) {
							const body = traceKey.slice('trace:'.length)
							const separator = body.lastIndexOf('/')
							if (separator <= 0 || separator === body.length - 1)
								throw new Error('CosmosSdk_Rest: invalid denom trace path key')

							const path = body.slice(0, separator)
							const baseDenom = body.slice(separator + 1)
							const channel = channelPartsFromPath(path)
							return {
								path,
								baseDenom,
								displayDenom: baseDenom,
								...(channel != null && {
									sourcePort: channel.sourcePort,
									sourceChannel: channel.sourceChannel,
									$channel: {
										[EntityMetaKey.Selector]: {
											$network,
											portId: channel.sourcePort,
											channelId: channel.sourceChannel,
										},
									},
								}),
								$cosmosDenom: {
									[EntityMetaKey.Selector]: {
										$network,
										denom: baseDenom,
									},
								},
							}
						}

						const {
							getIbcDenomTrace,
						} = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const {
							denom_trace: denomTrace,
						} = await getIbcDenomTrace({
							hash: traceKey,
						})
						const denomHash = (
							traceKey.startsWith('hash:') ?
								traceKey.slice('hash:'.length).toLowerCase()
							: traceKey.startsWith('ibc/') ?
								traceKey.slice('ibc/'.length).toLowerCase()
							:
								traceKey.toLowerCase()
						)
						const channel = channelPartsFromPath(denomTrace.path)
						return {
							path: denomTrace.path,
							baseDenom: denomTrace.base_denom,
							displayDenom: denomTrace.base_denom,
							denomHash,
							...(channel != null && {
								sourcePort: channel.sourcePort,
								sourceChannel: channel.sourceChannel,
								$channel: {
									[EntityMetaKey.Selector]: {
										$network,
										portId: channel.sourcePort,
										channelId: channel.sourceChannel,
									},
								},
							}),
							$cosmosDenom: {
								[EntityMetaKey.Selector]: {
									$network,
									denom: `ibc/${denomHash.toUpperCase()}`,
								},
							},
						}
					},
				},
			},
		})({
			path: (trace) => trace.path,
			baseDenom: (trace) => trace.baseDenom,
			displayDenom: (trace) => trace.displayDenom,
			denomHash: (trace) => trace.denomHash,
			sourcePort: (trace) => trace.sourcePort,
			sourceChannel: (trace) => trace.sourceChannel,
			$channel: (trace) => trace.$channel,
			$cosmosDenom: (trace) => trace.$cosmosDenom,
		}),
	],
} satisfies RegisteredSourceResolverModule
