import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import type { AlgorandIndexerTransaction } from '$/sources/AlgorandIndexer/Rest/types.ts'
import { type } from 'arktype'
import { bases } from 'multiformats/basics'

type AlgorandNetworkId = EntitySelector<typeof schema, EntityType.AlgorandNetwork>

const algorandAccountApplicability = [{
	$network: {
		$network: {
			slug: networkBySlug.algorand.slug,
		},
	},
}] as const

const algorandNetworkApplicability = [{
	$network: {
		slug: networkBySlug.algorand.slug,
	},
}] as const

const algorandNestedNetworkApplicability = [{
	$network: {
		$network: {
			slug: networkBySlug.algorand.slug,
		},
	},
}] as const

const assertAlgorandMainnet = (
	network: AlgorandNetworkId
) => {
	if (
		'slug' in network.$network
		&& network.$network.slug === networkBySlug.algorand.slug
	)
		return

	throw new Error('AlgorandIndexer_Rest: unsupported network')
}

const base64ToZeroExHex = (
	value: string,
	label: string
) => {
	try {
		const bytes = Uint8Array.from(
			globalThis.atob(value),
			(character) => character.charCodeAt(0)
		)
		return `0x${[...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')}` as const
	} catch {
		throw new Error(`AlgorandIndexer_Rest: malformed ${label}`)
	}
}

const zeroExHexToBase64 = (
	value: string,
	label: string
) => {
	try {
		if (!/^0x[\da-f]{64}$/i.test(value))
			throw new Error('expected 32-byte digest')
		return globalThis.btoa(value.slice(2).replace(/../g, (byte) => String.fromCharCode(Number.parseInt(byte, 16))))
	} catch {
		throw new Error(`AlgorandIndexer_Rest: malformed ${label}`)
	}
}

const algorandBase32DigestToZeroExHex = (
	value: string,
	label: string
) => {
	try {
		const bytes = bases.base32upper.decoder.decode(`B${value}`)
		if (bytes.length !== 32)
			throw new Error('expected 32-byte digest')
		return `0x${[...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')}` as const
	} catch {
		throw new Error(`AlgorandIndexer_Rest: malformed ${label}`)
	}
}

const defaultTransactionProofHashType = 'sha512_256' as const

const transactionProofFields = (
	proof: {
		hashtype: string
		proof: string
		stibhash: string
		treedepth: number
	}
) => ({
	hashType: proof.hashtype,
	proofBytes: proof.proof,
	stibHash: base64ToZeroExHex(proof.stibhash, 'transaction proof stibhash'),
	treeDepth: proof.treedepth,
})

const optionalSafeBigInt = (
	value: number | undefined
) => (
	value == null || !Number.isSafeInteger(value) || value < 0 ?
		undefined
	:
		BigInt(value)
)

const algorandAssetUrl = (
	value: string | undefined
) => {
	if (value == null)
		return undefined

	const parsed = UrlString(value)
	return parsed instanceof type.errors ? undefined : parsed
}

const transactionFields = (
	transaction: AlgorandIndexerTransaction,
	network: AlgorandNetworkId
) => ({
	sender: transaction.sender,
	transactionType: transaction['tx-type'],
	fee: optionalSafeBigInt(transaction.fee),
	round: optionalSafeBigInt(transaction['confirmed-round']),
	...(
		transaction.group != null && transaction.group.length > 0 && {
			group: base64ToZeroExHex(transaction.group, 'transaction group'),
			$group: {
				[EntityMetaKey.Selector]: {
					$network: network,
					group: base64ToZeroExHex(transaction.group, 'transaction group'),
				},
			},
		}
	),
	...(
		transaction.logs != null && {
			logs: transaction.logs,
		}
	),
	...(
		transaction['inner-txns'] != null && {
			innerTxns: transaction['inner-txns'],
		}
	),
	payload: transaction,
})

export default {
	source: Source.Nodely,

	resolvers: [
		defineResolver({
			entityType: EntityType.AlgorandAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: algorandAccountApplicability,
					resolve: async (account, context) => {
						assertAlgorandMainnet(account.$network)
						const { getAccountAssets } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						return getAccountAssets({
							address: account.address,
							limit: Math.min(resolverContextRowLimit(context), 1_000),
							next: context.providerContinuationToken,
						})
					},
				},
			},
		})({
			$$assetHoldingRounds: {
				select: (page, account) => page.assets.map((holding) => ({
					[EntityMetaKey.Selector]: {
						$account: account,
						$asset: {
							$network: account.$network,
							assetId: BigInt(holding['asset-id']),
						},
						round: BigInt(page['current-round']),
						source: Source.Nodely,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'amount')]: BigInt(holding.amount),
						[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'frozen')]: holding['is-frozen'],
						[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'optedInAtRound')]: (
							holding['opted-in-at-round'] == null ?
								undefined
							:
								BigInt(holding['opted-in-at-round'])
						),
						[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'deleted')]: holding.deleted,
					},
				})),
				continuation: (page, account) => (
					page['next-token'] == null ?
						{
							operation: 'account-asset-holdings',
							target: account.address,
							terminal: true,
						}
					:
						{
							operation: 'account-asset-holdings',
							target: account.address,
							terminal: false,
							token: page['next-token'],
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.AlgorandAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: algorandAccountApplicability,
					resolve: async (account, context) => {
						assertAlgorandMainnet(account.$network)
						if (resolverContextRowLimit(context) === 0)
							return []

						const { getAccount } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						const response = await getAccount(account.address)
						return [{
							[EntityMetaKey.Selector]: {
								$account: account,
								round: BigInt(response['current-round']),
								source: Source.Nodely,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.AlgorandAccount_Timestamp, [], 'amount')]: BigInt(response.account.amount),
								[entityFieldAddressKey(EntityType.AlgorandAccount_Timestamp, [], 'pendingRewards')]: (
									response.account['pending-rewards'] == null ?
										undefined
									:
										BigInt(response.account['pending-rewards'])
								),
								[entityFieldAddressKey(EntityType.AlgorandAccount_Timestamp, [], 'rewardsBase')]: (
									response.account['reward-base'] == null ?
										undefined
									:
										BigInt(response.account['reward-base'])
								),
								[entityFieldAddressKey(EntityType.AlgorandAccount_Timestamp, [], 'status')]: response.account.status,
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.AlgorandAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: algorandAccountApplicability,
					resolve: async (account, context) => {
						assertAlgorandMainnet(account.$network)
						const { getAccountApplications } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						return getAccountApplications({
							address: account.address,
							limit: Math.min(resolverContextRowLimit(context), 1_000),
							next: context.providerContinuationToken,
						})
					},
				},
			},
		})({
			$$applicationLocalStateRounds: {
				select: (page, account) => page['apps-local-states'].map((localState) => ({
					[EntityMetaKey.Selector]: {
						$account: account,
						$application: {
							$network: account.$network,
							applicationId: BigInt(localState.id),
						},
						round: BigInt(page['current-round']),
						source: Source.Nodely,
					},
					[EntityMetaKey.Fields]: {
						...(
							localState['key-value'] != null && {
								[entityFieldAddressKey(EntityType.AlgorandApplicationLocalState_Round, [], 'keyValues')]: localState['key-value'],
							}
						),
						...(
							localState.schema != null && {
								[entityFieldAddressKey(EntityType.AlgorandApplicationLocalState_Round, [], 'schema')]: localState.schema,
							}
						),
						[entityFieldAddressKey(EntityType.AlgorandApplicationLocalState_Round, [], 'deleted')]: localState.deleted,
					},
				})),
				continuation: (page, account) => (
					page['next-token'] == null ?
						{
							operation: 'account-application-local-states',
							target: account.address,
							terminal: true,
						}
					:
						{
							operation: 'account-application-local-states',
							target: account.address,
							terminal: false,
							token: page['next-token'],
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.AlgorandAsset,
			resolve: {
				NetworkAssetId: {
					appliesTo: algorandNestedNetworkApplicability,
					resolve: async (asset) => {
						assertAlgorandMainnet(asset.$network)
						const { getAsset } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						const response = await getAsset(asset.assetId)
						const params = response.asset.params
						const total = optionalSafeBigInt(params.total)
						const url = algorandAssetUrl(params.url)

						return {
							creator: params.creator,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$asset: asset,
									round: BigInt(response['current-round']),
									source: Source.Nodely,
								},
								[EntityMetaKey.Fields]: {
									...(
										total != null && {
											[entityFieldAddressKey(EntityType.AlgorandAsset_Timestamp, [], 'total')]: total,
										}
									),
									[entityFieldAddressKey(EntityType.AlgorandAsset_Timestamp, [], 'decimals')]: params.decimals,
									[entityFieldAddressKey(EntityType.AlgorandAsset_Timestamp, [], 'defaultFrozen')]: params['default-frozen'],
									[entityFieldAddressKey(EntityType.AlgorandAsset_Timestamp, [], 'unitName')]: params['unit-name'],
									[entityFieldAddressKey(EntityType.AlgorandAsset_Timestamp, [], 'assetName')]: params.name,
									...(url != null && {
										[entityFieldAddressKey(EntityType.AlgorandAsset_Timestamp, [], 'url')]: url,
									}),
									...(
										params['metadata-hash'] != null && params['metadata-hash'].length > 0 && {
											[entityFieldAddressKey(EntityType.AlgorandAsset_Timestamp, [], 'metadataHash')]: (
												base64ToZeroExHex(params['metadata-hash'], 'asset metadata hash')
											),
										}
									),
									[entityFieldAddressKey(EntityType.AlgorandAsset_Timestamp, [], 'manager')]: params.manager,
									[entityFieldAddressKey(EntityType.AlgorandAsset_Timestamp, [], 'reserve')]: params.reserve,
									[entityFieldAddressKey(EntityType.AlgorandAsset_Timestamp, [], 'freeze')]: params.freeze,
									[entityFieldAddressKey(EntityType.AlgorandAsset_Timestamp, [], 'clawback')]: params.clawback,
									[entityFieldAddressKey(EntityType.AlgorandAsset_Timestamp, [], 'deleted')]: response.asset.deleted,
								},
							}],
						}
					},
				},
			},
		})({
			creator: (snapshot) => snapshot.creator,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.AlgorandAsset,
			resolve: {
				NetworkAssetId: {
					appliesTo: algorandNestedNetworkApplicability,
					resolve: async (asset, context) => {
						assertAlgorandMainnet(asset.$network)
						const { getAssetBalances } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						return getAssetBalances({
							assetId: asset.assetId,
							limit: Math.min(resolverContextRowLimit(context), 1_000),
							next: context.providerContinuationToken,
						})
					},
				},
			},
		})({
			$$holdingRounds: {
				select: (page, asset) => page.balances.map((balance) => ({
					[EntityMetaKey.Selector]: {
						$account: {
							$network: asset.$network,
							address: balance.address,
						},
						$asset: asset,
						round: BigInt(page['current-round']),
						source: Source.Nodely,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'amount')]: BigInt(balance.amount),
						[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'frozen')]: balance['is-frozen'],
						[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'optedInAtRound')]: (
							balance['opted-in-at-round'] == null ?
								undefined
							:
								BigInt(balance['opted-in-at-round'])
						),
						[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'deleted')]: balance.deleted,
					},
				})),
				continuation: (page, asset) => (
					page['next-token'] == null ?
						{
							operation: 'asset-balances',
							target: asset.assetId.toString(),
							terminal: true,
						}
					:
						{
							operation: 'asset-balances',
							target: asset.assetId.toString(),
							terminal: false,
							token: page['next-token'],
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.AlgorandApplication,
			resolve: {
				NetworkApplicationId: {
					appliesTo: algorandNestedNetworkApplicability,
					resolve: async (application) => {
						assertAlgorandMainnet(application.$network)
						const { getApplication } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						const response = await getApplication(application.applicationId)
						const params = response.application.params

						return {
							creator: params.creator,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$application: application,
									round: BigInt(response['current-round']),
									source: Source.Nodely,
								},
								[EntityMetaKey.Fields]: {
									...(
										params['global-state'] != null && {
											[entityFieldAddressKey(EntityType.AlgorandApplication_Timestamp, [], 'globalState')]: params['global-state'],
										}
									),
									...(
										params['global-state-schema'] != null && {
											[entityFieldAddressKey(EntityType.AlgorandApplication_Timestamp, [], 'globalSchema')]: params['global-state-schema'],
										}
									),
									...(
										params['local-state-schema'] != null && {
											[entityFieldAddressKey(EntityType.AlgorandApplication_Timestamp, [], 'localSchema')]: params['local-state-schema'],
										}
									),
									[entityFieldAddressKey(EntityType.AlgorandApplication_Timestamp, [], 'deleted')]: response.application.deleted,
								},
							}],
						}
					},
				},
			},
		})({
			creator: (snapshot) => snapshot.creator,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.AlgorandApplication,
			resolve: {
				NetworkApplicationId: {
					appliesTo: algorandNestedNetworkApplicability,
					resolve: async (application, context) => {
						assertAlgorandMainnet(application.$network)
						const { listApplicationBoxes } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						return listApplicationBoxes({
							applicationId: application.applicationId,
							limit: Math.min(resolverContextRowLimit(context), 1_000),
							next: context.providerContinuationToken,
						})
					},
				},
			},
		})({
			$$boxes: {
				select: (page, application) => page.boxes.map((box) => ({
					[EntityMetaKey.Selector]: {
						$application: application,
						boxName: base64ToZeroExHex(box.name, 'box name'),
					},
				})),
				continuation: (page, application) => (
					page['next-token'] == null ?
						{
							operation: 'application-boxes',
							target: application.applicationId.toString(),
							terminal: true,
						}
					:
						{
							operation: 'application-boxes',
							target: application.applicationId.toString(),
							terminal: false,
							token: page['next-token'],
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.AlgorandApplication,
			resolve: {
				NetworkApplicationId: {
					appliesTo: algorandNestedNetworkApplicability,
					resolve: async (application, context) => {
						assertAlgorandMainnet(application.$network)
						const { getApplicationAccounts } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						return getApplicationAccounts({
							applicationId: application.applicationId,
							limit: Math.min(resolverContextRowLimit(context), 1_000),
							next: context.providerContinuationToken,
						})
					},
				},
			},
		})({
			$$localStateRounds: {
				select: (page, application) => page.accounts.flatMap((account) => (
					(account['apps-local-state'] ?? [])
						.filter((localState) => BigInt(localState.id) === application.applicationId)
						.map((localState) => ({
							[EntityMetaKey.Selector]: {
								$account: {
									$network: application.$network,
									address: account.address,
								},
								$application: application,
								round: BigInt(page['current-round']),
								source: Source.Nodely,
							},
							[EntityMetaKey.Fields]: {
								...(localState['key-value'] != null && {
									[entityFieldAddressKey(EntityType.AlgorandApplicationLocalState_Round, [], 'keyValues')]: localState['key-value'],
								}),
								...(localState.schema != null && {
									[entityFieldAddressKey(EntityType.AlgorandApplicationLocalState_Round, [], 'schema')]: localState.schema,
								}),
								[entityFieldAddressKey(EntityType.AlgorandApplicationLocalState_Round, [], 'deleted')]: localState.deleted,
							},
						}))
				)),
				continuation: (page, application) => (
					page['next-token'] == null ?
						{
							operation: 'application-local-state-rounds',
							target: application.applicationId.toString(),
							terminal: true,
						}
					:
						{
							operation: 'application-local-state-rounds',
							target: application.applicationId.toString(),
							terminal: false,
							token: page['next-token'],
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.AlgorandTransaction,
			resolve: {
				NetworkTxId: {
					appliesTo: algorandNestedNetworkApplicability,
					resolve: async (transaction) => {
						assertAlgorandMainnet(transaction.$network)
						const { getTransaction } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						const response = await getTransaction(transaction.txId)
						return transactionFields(response.transaction, transaction.$network)
					},
				},
			},
		})({
			sender: (snapshot) => snapshot.sender,
			transactionType: (snapshot) => snapshot.transactionType,
			fee: (snapshot) => snapshot.fee,
			round: (snapshot) => snapshot.round,
			group: (snapshot) => snapshot.group,
			$group: (snapshot) => snapshot.$group,
			logs: (snapshot) => snapshot.logs,
			innerTxns: (snapshot) => snapshot.innerTxns,
			payload: (snapshot) => snapshot.payload,
		}),

		defineResolver({
			entityType: EntityType.AlgorandTransaction,
			resolve: {
				NetworkTxId: {
					appliesTo: algorandNestedNetworkApplicability,
					resolve: async (transaction, context) => {
						assertAlgorandMainnet(transaction.$network)
						if (resolverContextRowLimit(context) === 0)
							return []

						const { getTransaction } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						const response = await getTransaction(transaction.txId)
						const round = optionalSafeBigInt(response.transaction['confirmed-round'])
						if (round == null)
							throw new Error('AlgorandIndexer_Rest: transaction proof requires a confirmed round')

						const { getTransactionProof } = await import('$/sources/Algod/Rest/queries.ts')
						const proof = await getTransactionProof({
							round,
							txId: transaction.txId,
							hashType: defaultTransactionProofHashType,
						})
						const fields = transactionProofFields(proof)
						return [{
							[EntityMetaKey.Selector]: {
								$transaction: transaction,
								round,
								hashType: proof.hashtype,
								source: Source.Nodely,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.AlgorandTransactionProof, [], 'proofBytes')]: fields.proofBytes,
								[entityFieldAddressKey(EntityType.AlgorandTransactionProof, [], 'stibHash')]: fields.stibHash,
								[entityFieldAddressKey(EntityType.AlgorandTransactionProof, [], 'treeDepth')]: fields.treeDepth,
							},
						}]
					},
				},
			},
		})({
			$$proofs: (proofs) => proofs,
		}),

		defineResolver({
			entityType: EntityType.AlgorandTransactionProof,
			resolve: {
				TransactionRoundHashTypeSource: {
					appliesTo: [{
						$transaction: {
							$network: {
								$network: {
									slug: networkBySlug.algorand.slug,
								},
							},
						},
					}],
					resolve: async (proof) => {
						assertAlgorandMainnet(proof.$transaction.$network)
						if (
							proof.hashType !== 'sha512_256'
							&& proof.hashType !== 'sha256'
						)
							throw new Error(`AlgorandIndexer_Rest: unsupported proof hashtype ${proof.hashType}`)

						const { getTransaction } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						const response = await getTransaction(proof.$transaction.txId)
						const confirmedRound = optionalSafeBigInt(response.transaction['confirmed-round'])
						if (confirmedRound == null)
							throw new Error('AlgorandIndexer_Rest: transaction proof requires a confirmed round')
						if (confirmedRound !== proof.round)
							throw new Error('AlgorandIndexer_Rest: transaction proof round does not match confirmed round')

						const { getTransactionProof } = await import('$/sources/Algod/Rest/queries.ts')
						return transactionProofFields(
							await getTransactionProof({
								round: proof.round,
								txId: proof.$transaction.txId,
								hashType: proof.hashType,
							})
						)
					},
				},
			},
		})({
			proofBytes: (snapshot) => snapshot.proofBytes,
			stibHash: (snapshot) => snapshot.stibHash,
			treeDepth: (snapshot) => snapshot.treeDepth,
		}),

		defineResolver({
			entityType: EntityType.AlgorandRound,
			resolve: {
				NetworkRound: {
					appliesTo: algorandNestedNetworkApplicability,
					resolve: async (round) => {
						assertAlgorandMainnet(round.$network)
						const { getBlock } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						const { getBlockHash } = await import('$/sources/Algod/Rest/queries.ts')
						const [
							block,
							blockHash,
						] = await Promise.all([
							getBlock(round.round),
							getBlockHash(round.round),
						])
						return {
							hash: algorandBase32DigestToZeroExHex(blockHash.blockHash, 'block hash'),
							timestampMs: block.timestamp * 1_000,
							...(
								block['genesis-hash'] != null && block['genesis-hash'].length > 0 && {
									genesisHash: base64ToZeroExHex(block['genesis-hash'], 'genesis hash'),
								}
							),
							proposer: block.proposer,
						}
					},
				},
			},
		})({
			hash: (snapshot) => snapshot.hash,
			timestampMs: (snapshot) => snapshot.timestampMs,
			genesisHash: (snapshot) => snapshot.genesisHash,
			proposer: (snapshot) => snapshot.proposer,
		}),

		defineResolver({
			entityType: EntityType.AlgorandNetwork,
			resolve: {
				Network: {
					appliesTo: algorandNetworkApplicability,
					resolve: async (algorandNetwork, context) => {
						assertAlgorandMainnet(algorandNetwork)
						if (resolverContextRowLimit(context) === 0)
							return []

						const {
							getBlock,
							getHealth,
						} = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						const { getStatus } = await import('$/sources/Algod/Rest/queries.ts')
						const [health, status] = await Promise.all([
							getHealth(),
							getStatus(),
						])
						const latestRound = health.round ?? health.data?.round
						if (latestRound == null || !Number.isSafeInteger(latestRound) || latestRound < 0)
							throw new Error('AlgorandIndexer_Rest: health response missing tip round')

						const tip = await getBlock(BigInt(latestRound))
						return [{
							[EntityMetaKey.Selector]: {
								$network: algorandNetwork,
								timestampMs: tip.timestamp * 1_000,
								source: Source.Nodely,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.AlgorandNetwork_Timestamp, [], 'latestRound')]: BigInt(latestRound),
								...(
									tip['genesis-hash'] != null && tip['genesis-hash'].length > 0 && {
										[entityFieldAddressKey(EntityType.AlgorandNetwork_Timestamp, [], 'genesisHash')]: (
											base64ToZeroExHex(tip['genesis-hash'], 'genesis hash')
										),
									}
								),
								...(
									status.catchpoint != null && status.catchpoint.length > 0 && {
										[entityFieldAddressKey(EntityType.AlgorandNetwork_Timestamp, [], 'catchpoint')]: status.catchpoint,
									}
								),
								[entityFieldAddressKey(EntityType.AlgorandNetwork_Timestamp, [], 'protocolVersion')]: status['last-version'],
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.AlgorandNetwork,
			resolve: {
				Network: {
					appliesTo: algorandNetworkApplicability,
					resolve: async (algorandNetwork, context) => {
						assertAlgorandMainnet(algorandNetwork)
						const { listTransactions } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						return listTransactions({
							limit: Math.min(resolverContextRowLimit(context), 1_000),
							next: context.providerContinuationToken,
						})
					},
				},
			},
		})({
			$$transactions: {
				select: (page, algorandNetwork) => page.transactions.map((transaction) => ({
					[EntityMetaKey.Selector]: {
						$network: algorandNetwork,
						txId: transaction.id,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.AlgorandTransaction, [], 'sender')]: transaction.sender,
						[entityFieldAddressKey(EntityType.AlgorandTransaction, [], 'transactionType')]: transaction['tx-type'],
						[entityFieldAddressKey(EntityType.AlgorandTransaction, [], 'fee')]: optionalSafeBigInt(transaction.fee),
						[entityFieldAddressKey(EntityType.AlgorandTransaction, [], 'round')]: optionalSafeBigInt(transaction['confirmed-round']),
					},
				})),
				continuation: (page) => (
					page['next-token'] == null ?
						{
							operation: 'network-transactions',
							terminal: true,
						}
					:
						{
							operation: 'network-transactions',
							terminal: false,
							token: page['next-token'],
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.AlgorandTransactionGroup,
			resolve: {
				NetworkGroup: {
					appliesTo: algorandNestedNetworkApplicability,
					resolve: async (group, context) => {
						assertAlgorandMainnet(group.$network)
						const { listTransactions } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						return listTransactions({
							groupId: zeroExHexToBase64(group.group, 'transaction group'),
							limit: Math.min(resolverContextRowLimit(context), 1_000),
							next: context.providerContinuationToken,
						})
					},
				},
			},
		})({
			$$transactions: {
				select: (page, group) => page.transactions.map((transaction) => ({
					[EntityMetaKey.Selector]: {
						$network: group.$network,
						txId: transaction.id,
					},
					[EntityMetaKey.Fields]: transactionFields(transaction, group.$network),
				})),
				continuation: (page, group) => (
					page['next-token'] == null ?
						{
							operation: 'transaction-group-transactions',
							target: group.group,
							terminal: true,
						}
					:
						{
							operation: 'transaction-group-transactions',
							target: group.group,
							terminal: false,
							token: page['next-token'],
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.AlgorandNetwork,
			resolve: {
				Network: {
					appliesTo: algorandNetworkApplicability,
					resolve: async (algorandNetwork, context) => {
						assertAlgorandMainnet(algorandNetwork)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)

						const {
							getHealth,
						} = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						const health = await getHealth()
						const tipRound = health.round ?? health.data?.round
						if (tipRound == null || !Number.isSafeInteger(tipRound) || tipRound < 0)
							throw new Error('AlgorandIndexer_Rest: health response missing tip round')

						const cursorRound = (
							context.providerContinuationToken == null ?
								BigInt(tipRound)
							:
								BigInt(context.providerContinuationToken)
						)
						if (cursorRound < 0n)
							throw new Error('AlgorandIndexer_Rest: malformed rounds continuation')

						const rounds = Array.from({ length: Number(limit) }, (_value, index) => (
							cursorRound - BigInt(index)
						))
							.filter((round) => round >= 0n)

						return {
							tipRound: BigInt(tipRound),
							rounds,
						}
					},
				},
			},
		})({
			$$rounds: {
				select: ({ rounds }, algorandNetwork) => rounds.map((round) => ({
					[EntityMetaKey.Selector]: {
						$network: algorandNetwork,
						round,
					},
				})),
				resolveCount: ({ tipRound }) => tipRound + 1n,
				continuation: ({ rounds }) => {
					const lastRound = rounds.at(-1)
					if (lastRound == null || lastRound === 0n)
						return {
							operation: 'network-rounds',
							terminal: true,
						}

					return {
						operation: 'network-rounds',
						terminal: false,
						token: (lastRound - 1n).toString(),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.AlgorandNetwork,
			resolve: {
				Network: {
					appliesTo: algorandNetworkApplicability,
					resolve: async (algorandNetwork, context) => {
						assertAlgorandMainnet(algorandNetwork)
						const { listAccounts } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						return listAccounts({
							limit: Math.min(resolverContextRowLimit(context), 1_000),
							next: context.providerContinuationToken,
						})
					},
				},
			},
		})({
			$$accounts: {
				select: (page, algorandNetwork) => page.accounts.map((account) => ({
					[EntityMetaKey.Selector]: {
						$network: algorandNetwork,
						address: account.address,
					},
				})),
				continuation: (page) => (
					page['next-token'] == null ?
						{
							operation: 'network-accounts',
							terminal: true,
						}
					:
						{
							operation: 'network-accounts',
							terminal: false,
							token: page['next-token'],
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.AlgorandNetwork,
			resolve: {
				Network: {
					appliesTo: algorandNetworkApplicability,
					resolve: async (algorandNetwork, context) => {
						assertAlgorandMainnet(algorandNetwork)
						const { listAssets } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						return listAssets({
							limit: Math.min(resolverContextRowLimit(context), 1_000),
							next: context.providerContinuationToken,
						})
					},
				},
			},
		})({
			$$assets: {
				select: (page, algorandNetwork) => page.assets.map((asset) => ({
					[EntityMetaKey.Selector]: {
						$network: algorandNetwork,
						assetId: BigInt(asset.index),
					},
				})),
				continuation: (page) => (
					page['next-token'] == null ?
						{
							operation: 'network-assets',
							terminal: true,
						}
					:
						{
							operation: 'network-assets',
							terminal: false,
							token: page['next-token'],
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.AlgorandNetwork,
			resolve: {
				Network: {
					appliesTo: algorandNetworkApplicability,
					resolve: async (algorandNetwork, context) => {
						assertAlgorandMainnet(algorandNetwork)
						const { listApplications } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						return listApplications({
							limit: Math.min(resolverContextRowLimit(context), 1_000),
							next: context.providerContinuationToken,
						})
					},
				},
			},
		})({
			$$applications: {
				select: (page, algorandNetwork) => page.applications.map((application) => ({
					[EntityMetaKey.Selector]: {
						$network: algorandNetwork,
						applicationId: BigInt(application.id),
					},
				})),
				continuation: (page) => (
					page['next-token'] == null ?
						{
							operation: 'network-applications',
							terminal: true,
						}
					:
						{
							operation: 'network-applications',
							terminal: false,
							token: page['next-token'],
						}
				),
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
