import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import {
	bigintFromWire,
	timestampMsFromWire,
	type DappetizerAction,
	type DappetizerBlock,
	type DappetizerContract,
	type DappetizerToken,
} from '$/sources/TezosDappetizer/Postgres/types.ts'


type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertTezosMainnet = (network: NetworkId) => {
	if (
		('slug' in network && network.slug === networkBySlug.tezos.slug)
		|| (
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.tezos.caip2.namespace
			&& network.caip2.reference === networkBySlug.tezos.caip2.reference
		)
	)
		return

	throw new Error('TezosDappetizer_Postgres: unsupported network')
}

const accountKindFromAddress = (
	address: string
) => (
	address.startsWith('KT') ?
		'contract'
	: address.startsWith('sr') ?
		'smart_rollup'
	:
		'user'
)

const pageOffset = (token: string | undefined) => {
	if (token == null)
		return 0

	const offset = Number(token)
	if (!Number.isSafeInteger(offset) || offset < 0 || String(offset) !== token)
		throw new Error('TezosDappetizer_Postgres: invalid continuation')

	return offset
}

const pageContinuation = (
	operation: string,
	offset: number,
	limit: number,
	rowCount: number
) => (
	rowCount < limit ?
		{
			operation,
			terminal: true,
		}
	:
		{
			operation,
			terminal: false,
			token: String(offset + rowCount),
		}
)

const blockFieldsFromWire = (
	tezosNetwork: { $network: NetworkId },
	block: DappetizerBlock,
	level: bigint
) => {
	const timestampMs = timestampMsFromWire(block.timestamp)
	if (timestampMs == null)
		throw new Error(`TezosDappetizer_Postgres: block ${level.toString()} has an invalid timestamp`)
	if (BigInt(block.level) !== level)
		throw new Error(`TezosDappetizer_Postgres: block response level ${block.level} does not match ${level.toString()}`)

	return {
		$network: {
			[EntityMetaKey.Selector]: tezosNetwork,
		},
		level,
		hash: block.hash,
		timestampMs,
		predecessorHash: block.predecessor,
	}
}

const contractFieldsFromWire = (
	tezosNetwork: { $network: NetworkId },
	address: string,
	contract: DappetizerContract
) => {
	if (contract.address !== address)
		throw new Error('TezosDappetizer_Postgres: contract response does not match the subject')

	return {
		$network: {
			[EntityMetaKey.Selector]: tezosNetwork,
		},
		address,
		$account: {
			[EntityMetaKey.Selector]: {
				$network: tezosNetwork,
				address,
			},
		},
	}
}

const tokenFieldsFromWire = (
	tezosNetwork: { $network: NetworkId },
	contractAddress: string,
	tokenId: bigint,
	token: DappetizerToken
) => {
	if (token.contractAddress !== contractAddress)
		throw new Error('TezosDappetizer_Postgres: token contract address does not match the subject')
	if (bigintFromWire(token.id, 'token id') !== tokenId)
		throw new Error('TezosDappetizer_Postgres: token id does not match the subject')

	return {
		$network: {
			[EntityMetaKey.Selector]: tezosNetwork,
		},
		contractAddress,
		tokenId,
		$contract: {
			[EntityMetaKey.Selector]: {
				$network: tezosNetwork,
				address: contractAddress,
			},
		},
	}
}

const transferFieldsFromWire = (
	tezosNetwork: { $network: NetworkId },
	action: DappetizerAction
) => {
	const tokenId = bigintFromWire(action.tokenId, 'token id')
	const transferId = `${action.operationGroupHash}:${action.order}`
	const timestampMs = timestampMsFromWire(action.timestamp ?? undefined)

	return {
		[EntityMetaKey.Selector]: {
			$network: tezosNetwork,
			transferId,
			source: Source.TezosDappetizer_Postgres,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], '$token')]: {
				[EntityMetaKey.Selector]: {
					$network: tezosNetwork,
					contractAddress: action.tokenContractAddress,
					tokenId,
				},
			},
			...(action.fromAddress != null && action.fromAddress.length > 0 && {
				[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], '$from')]: {
					[EntityMetaKey.Selector]: {
						$network: tezosNetwork,
						address: action.fromAddress,
					},
				},
			}),
			...(action.toAddress != null && action.toAddress.length > 0 && {
				[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], '$to')]: {
					[EntityMetaKey.Selector]: {
						$network: tezosNetwork,
						address: action.toAddress,
					},
				},
			}),
			...(action.level != null && {
				[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'level')]: BigInt(action.level),
			}),
			...(timestampMs != null && {
				[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'timestampMs')]: timestampMs,
			}),
			[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'contractAddress')]: action.tokenContractAddress,
			[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'tokenId')]: tokenId,
			...(action.amount != null && {
				[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'amount')]: bigintFromWire(action.amount, 'transfer amount'),
			}),
			[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'transactionId')]: action.operationGroupHash,
		},
	}
}


export default {
	source: Source.TezosDappetizer_Postgres,

	resolvers: [
		defineResolver({
			entityType: EntityType.TezosNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertTezosMainnet($network)
						const { getSettings } = await import('$/sources/TezosDappetizer/Postgres/queries.ts')
						const settings = await getSettings()
						if (settings.chainId !== networkBySlug.tezos.caip2.reference)
							throw new Error(`TezosDappetizer_Postgres: settings chainId ${settings.chainId} is not Tezos mainnet`)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
						}
					},
				},
			},
		})({
			$network: (network) => network.$network,
		}),

		defineResolver({
			entityType: EntityType.TezosBlock,
			resolve: {
				NetworkLevel: {
					resolve: async ({ $network, level }) => {
						assertTezosMainnet($network.$network)
						if (level < 0n || level > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error(`TezosDappetizer_Postgres: unsupported block level ${level.toString()}`)

						const { getBlockByLevel } = await import('$/sources/TezosDappetizer/Postgres/queries.ts')
						return blockFieldsFromWire(
							$network,
							await getBlockByLevel({
								level: Number(level),
							}),
							level
						)
					},
				},
				NetworkHash: {
					resolve: async ({ $network, hash }) => {
						assertTezosMainnet($network.$network)
						const { getBlockByHash } = await import('$/sources/TezosDappetizer/Postgres/queries.ts')
						const block = await getBlockByHash({
							hash,
						})
						return blockFieldsFromWire(
							$network,
							block,
							BigInt(block.level)
						)
					},
				},
			},
		})({
			$network: (block) => block.$network,
			level: (block) => block.level,
			hash: (block) => block.hash,
			timestampMs: (block) => block.timestampMs,
			predecessorHash: (block) => block.predecessorHash,
		}),

		defineResolver({
			entityType: EntityType.TezosNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const offset = pageOffset(context.providerContinuationToken)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)
						const { listBlocks } = await import('$/sources/TezosDappetizer/Postgres/queries.ts')
						const blocks = await listBlocks({
							offset,
							limit,
						})
						return {
							blocks,
							limit,
							offset,
						}
					},
				},
			},
		})({
			$$blocks: {
				select: (page, { $network }) => page.blocks.map((block: DappetizerBlock) => ({
					[EntityMetaKey.Selector]: {
						$network: { $network },
						level: BigInt(block.level),
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.TezosBlock, [], 'hash')]: block.hash,
						[entityFieldAddressKey(EntityType.TezosBlock, [], 'timestampMs')]: timestampMsFromWire(block.timestamp),
						[entityFieldAddressKey(EntityType.TezosBlock, [], 'predecessorHash')]: block.predecessor,
					},
				})),
				continuation: (page) => pageContinuation(
					'network-blocks',
					page.offset,
					page.limit,
					page.blocks.length
				),
			},
		}),

		defineResolver({
			entityType: EntityType.TezosContract,
			resolve: {
				NetworkAddress: {
					resolve: async ({ $network, address }) => {
						assertTezosMainnet($network.$network)
						const { getContract } = await import('$/sources/TezosDappetizer/Postgres/queries.ts')
						return contractFieldsFromWire(
							$network,
							address,
							await getContract({
								address,
							})
						)
					},
				},
			},
		})({
			$network: (contract) => contract.$network,
			address: (contract) => contract.address,
			$account: (contract) => contract.$account,
		}),

		defineResolver({
			entityType: EntityType.TezosNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const offset = pageOffset(context.providerContinuationToken)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)
						const { listContracts } = await import('$/sources/TezosDappetizer/Postgres/queries.ts')
						const contracts = await listContracts({
							offset,
							limit,
						})
						for (const contract of contracts) {
							if (contract.address.length === 0)
								throw new Error('TezosDappetizer_Postgres: contract list returned an empty address')
						}
						return {
							contracts,
							limit,
							offset,
						}
					},
				},
			},
		})({
			$$contracts: {
				select: (page, { $network }) => page.contracts.map((contract: DappetizerContract) => ({
					[EntityMetaKey.Selector]: {
						$network: { $network },
						address: contract.address,
					},
				})),
				continuation: (page) => pageContinuation(
					'network-contracts',
					page.offset,
					page.limit,
					page.contracts.length
				),
			},
		}),

		defineResolver({
			entityType: EntityType.TezosAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account) => {
						assertTezosMainnet(account.$network.$network)
						const { findAccountEvidence } = await import('$/sources/TezosDappetizer/Postgres/queries.ts')
						const evidence = await findAccountEvidence({
							address: account.address,
						})
						return {
							accountKind: (
								evidence.kind === 'contract' ?
									'contract'
								:
									accountKindFromAddress(account.address)
							),
						}
					},
				},
			},
		})({
			accountKind: (account) => account.accountKind,
		}),

		defineResolver({
			entityType: EntityType.TezosAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account, context) => {
						assertTezosMainnet(account.$network.$network)
						const offset = pageOffset(context.providerContinuationToken)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)
						const { listAccountBalances } = await import('$/sources/TezosDappetizer/Postgres/queries.ts')
						const balances = await listAccountBalances({
							ownerAddress: account.address,
							offset,
							limit,
						})
						return {
							balances,
							limit,
							offset,
						}
					},
				},
			},
		})({
			$$tokenBalanceTimestamps: {
				select: (page, account) => page.balances.map((balance) => {
					const tokenId = bigintFromWire(balance.tokenId, 'token id')
					const level = (
						balance.level == null ?
							0n
						:
							BigInt(balance.level)
					)
					const timestampMs = timestampMsFromWire(balance.timestamp ?? undefined)
					return {
						[EntityMetaKey.Selector]: {
							$account: account,
							$token: {
								$network: account.$network,
								contractAddress: balance.tokenContractAddress,
								tokenId,
							},
							level,
							source: Source.TezosDappetizer_Postgres,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.TezosTokenBalance_Timestamp, [], 'balance')]: bigintFromWire(balance.amount, 'balance amount'),
							[entityFieldAddressKey(EntityType.TezosTokenBalance_Timestamp, [], 'contractAddress')]: balance.tokenContractAddress,
							[entityFieldAddressKey(EntityType.TezosTokenBalance_Timestamp, [], 'tokenId')]: tokenId,
							...(timestampMs != null && {
								[entityFieldAddressKey(EntityType.TezosTokenBalance_Timestamp, [], 'timestampMs')]: timestampMs,
							}),
						},
					}
				}),
				continuation: (page) => pageContinuation(
					'account-token-balances',
					page.offset,
					page.limit,
					page.balances.length
				),
			},
		}),

		defineResolver({
			entityType: EntityType.TezosAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account, context) => {
						assertTezosMainnet(account.$network.$network)
						const offset = pageOffset(context.providerContinuationToken)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)
						const { listAccountTransferActions } = await import('$/sources/TezosDappetizer/Postgres/queries.ts')
						const actions = await listAccountTransferActions({
							address: account.address,
							offset,
							limit,
						})
						return {
							actions,
							limit,
							offset,
						}
					},
				},
			},
		})({
			$$tokenTransfers: {
				select: (page, account) => page.actions.map((action: DappetizerAction) => (
					transferFieldsFromWire(account.$network, action)
				)),
				continuation: (page) => pageContinuation(
					'account-token-transfers',
					page.offset,
					page.limit,
					page.actions.length
				),
			},
		}),

		defineResolver({
			entityType: EntityType.TezosToken,
			resolve: {
				NetworkContractAddressTokenId: {
					resolve: async ({
						$network,
						contractAddress,
						tokenId,
					}) => {
						assertTezosMainnet($network.$network)
						if (tokenId < 0n)
							throw new Error(`TezosDappetizer_Postgres: unsupported token id ${tokenId.toString()}`)
						const { getToken } = await import('$/sources/TezosDappetizer/Postgres/queries.ts')
						return tokenFieldsFromWire(
							$network,
							contractAddress,
							tokenId,
							await getToken({
								contractAddress,
								tokenId,
							})
						)
					},
				},
			},
		})({
			$network: (token) => token.$network,
			contractAddress: (token) => token.contractAddress,
			tokenId: (token) => token.tokenId,
			$contract: (token) => token.$contract,
		}),

		defineResolver({
			entityType: EntityType.TezosToken,
			resolve: {
				NetworkContractAddressTokenId: {
					resolve: async ({
						$network,
						contractAddress,
						tokenId,
					}) => {
						assertTezosMainnet($network.$network)
						const {
							getBlockByHash,
							getToken,
						} = await import('$/sources/TezosDappetizer/Postgres/queries.ts')
						const token = await getToken({
							contractAddress,
							tokenId,
						})
						const firstBlock = await getBlockByHash({
							hash: token.firstBlockHash,
						})
						const level = BigInt(firstBlock.level)
						const timestampMs = timestampMsFromWire(firstBlock.timestamp)
						return [{
							[EntityMetaKey.Selector]: {
								$token: {
									$network,
									contractAddress,
									tokenId,
								},
								level,
								source: Source.TezosDappetizer_Postgres,
							},
							[EntityMetaKey.Fields]: {
								...(timestampMs != null && {
									[entityFieldAddressKey(EntityType.TezosToken_Timestamp, [], 'timestampMs')]: timestampMs,
								}),
								...(token.name != null && token.name.length > 0 && {
									[entityFieldAddressKey(EntityType.TezosToken_Timestamp, [], 'name')]: token.name,
								}),
								...(token.symbol != null && token.symbol.length > 0 && {
									[entityFieldAddressKey(EntityType.TezosToken_Timestamp, [], 'symbol')]: token.symbol,
								}),
								...(token.decimals != null && {
									[entityFieldAddressKey(EntityType.TezosToken_Timestamp, [], 'decimals')]: token.decimals,
								}),
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.TezosToken_Timestamp,
			resolve: {
				TokenLevelSource: {
					resolve: async ({
						$token,
						level,
						source,
					}) => {
						assertTezosMainnet($token.$network.$network)
						if (source !== Source.TezosDappetizer_Postgres)
							throw new Error(`TezosDappetizer_Postgres: unsupported observation source ${source}`)
						const {
							getBlockByHash,
							getToken,
						} = await import('$/sources/TezosDappetizer/Postgres/queries.ts')
						const token = await getToken({
							contractAddress: $token.contractAddress,
							tokenId: $token.tokenId,
						})
						const firstBlock = await getBlockByHash({
							hash: token.firstBlockHash,
						})
						if (BigInt(firstBlock.level) !== level)
							throw new Error(`TezosDappetizer_Postgres: token observation level ${firstBlock.level} does not match ${level.toString()}`)
						const timestampMs = timestampMsFromWire(firstBlock.timestamp)
						return {
							$token: {
								[EntityMetaKey.Selector]: $token,
							},
							level,
							source,
							...(timestampMs != null && {
								timestampMs,
							}),
							...(token.name != null && token.name.length > 0 && {
								name: token.name,
							}),
							...(token.symbol != null && token.symbol.length > 0 && {
								symbol: token.symbol,
							}),
							...(token.decimals != null && {
								decimals: token.decimals,
							}),
						}
					},
				},
			},
		})({
			$token: (timestamp) => timestamp.$token,
			level: (timestamp) => timestamp.level,
			source: (timestamp) => timestamp.source,
			timestampMs: (timestamp) => timestamp.timestampMs,
			name: (timestamp) => timestamp.name,
			symbol: (timestamp) => timestamp.symbol,
			decimals: (timestamp) => timestamp.decimals,
		}),

		defineResolver({
			entityType: EntityType.TezosNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const offset = pageOffset(context.providerContinuationToken)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)
						const { listTokens } = await import('$/sources/TezosDappetizer/Postgres/queries.ts')
						const tokens = await listTokens({
							offset,
							limit,
						})
						return {
							tokens,
							limit,
							offset,
						}
					},
				},
			},
		})({
			$$tokens: {
				select: (page, { $network }) => page.tokens.map((token: DappetizerToken) => ({
					[EntityMetaKey.Selector]: {
						$network: { $network },
						contractAddress: token.contractAddress,
						tokenId: bigintFromWire(token.id, 'token id'),
					},
				})),
				continuation: (page) => pageContinuation(
					'network-tokens',
					page.offset,
					page.limit,
					page.tokens.length
				),
			},
		}),

		defineResolver({
			entityType: EntityType.TezosNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const offset = pageOffset(context.providerContinuationToken)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)
						const { listTransferActions } = await import('$/sources/TezosDappetizer/Postgres/queries.ts')
						const actions = await listTransferActions({
							offset,
							limit,
						})
						return {
							actions,
							limit,
							offset,
						}
					},
				},
			},
		})({
			$$tokenTransfers: {
				select: (page, { $network }) => page.actions.map((action: DappetizerAction) => (
					transferFieldsFromWire({ $network }, action)
				)),
				continuation: (page) => pageContinuation(
					'network-token-transfers',
					page.offset,
					page.limit,
					page.actions.length
				),
			},
		}),
	],
} satisfies RegisteredSourceResolverModule<Source.TezosDappetizer_Postgres>
