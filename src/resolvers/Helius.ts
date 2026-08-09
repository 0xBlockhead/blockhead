import type { ResolverContext } from '$/resolvers/$resolvers.ts'
import {
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { heliusBindingByApiFamily } from '$/sources/Helius/constants.ts'
import { heliusDasQueries } from '$/sources/Helius/Das/queries.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import type { DasAssetWire } from '$/sources/Helius/Das/types.ts'
import type { HeliusEnhancedTransaction } from '$/sources/Helius/Rest/types.ts'
import { SolanaInstructionKind } from '$/schema/SolanaInstructionKind.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const heliusRestBinding = heliusBindingByApiFamily[ApiFamily.RestJson]
const heliusDasBinding = heliusBindingByApiFamily[ApiFamily.MetaplexDasJsonRpc]

if (heliusRestBinding == null || heliusDasBinding == null)
	throw new Error('Helius: required source binding is missing')

const {
	getAsset,
	getAssetsByOwner,
} = heliusDasQueries(heliusDasBinding)

const assertSolanaMainnet = (network: NetworkId) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== 'solana'
		|| network.caip2.reference !== '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
	) {
		throw new Error('Helius: unsupported network')
	}
}

const heliusTransactionFields = (
	network: NetworkId,
	transaction: HeliusEnhancedTransaction
) => ({
	$block: {
		[EntityMetaKey.Selector]: {
			$network: network,
			slot: BigInt(transaction.slot),
		},
	},
	...(transaction.feePayer != null && {
		$feePayer: {
			[EntityMetaKey.Selector]: {
				$network: network,
				pubkey: transaction.feePayer,
			},
		},
	}),
})

const heliusTransactionTimestampFields = (
	transactionId: {
		$network: NetworkId
		signature: string
	},
	transaction: HeliusEnhancedTransaction
) => ({
	[EntityMetaKey.Selector]: {
		$transaction: transactionId,
		slot: BigInt(transaction.slot),
		source: Source.Helius,
	},
	$transaction: {
		[EntityMetaKey.Selector]: transactionId,
	},
	slot: BigInt(transaction.slot),
	source: Source.Helius,
	...(transaction.timestamp != null && {
		timestampMs: transaction.timestamp * 1000,
	}),
	...(transaction.fee != null && {
		feeLamports: BigInt(transaction.fee),
	}),
	status: transaction.transactionError == null ? 'success' : 'failed',
	...(transaction.transactionError != null && {
		err: transaction.transactionError,
	}),
})

const heliusInstructionRows = (
	transactionId: {
		$network: NetworkId
		signature: string
	},
	transaction: HeliusEnhancedTransaction
) => (
	(transaction.instructions ?? []).map((instruction, indexInTransaction) => ({
		[EntityMetaKey.Selector]: {
			$transaction: transactionId,
			instructionKind: SolanaInstructionKind.Instruction,
			indexInTransaction,
		},
		$program: {
			[EntityMetaKey.Selector]: {
				$network: transactionId.$network,
				programId: instruction.programId,
			},
		},
		...(instruction.data != null && {
			data: instruction.data,
		}),
		$$accounts: (
			instruction.accounts?.map((pubkey) => ({
				[EntityMetaKey.Selector]: {
					$network: transactionId.$network,
					pubkey,
				},
			})) ?? []
		),
	}))
)

const getTransaction = async (
	{ $network, signature }: {
		$network: NetworkId
		signature: string
	},
	context: ResolverContext
) => {
	assertSolanaMainnet($network)
	const { getEnhancedTransactions } = await import('$/sources/Helius/Rest/queries.ts')
	const transaction = (await getEnhancedTransactions({
		binding: heliusRestBinding,
		signatures: [signature],
		publicEnv: context.publicEnv,
	})).find((enhancedTransaction) => enhancedTransaction.signature === signature)
	if (transaction == null) throw new Error(`Helius: transaction not found for signature ${signature}`)
	return transaction
}

const requireIndexedSlot = (
	lastIndexedSlot: number | undefined,
	label: string,
) => {
	if (lastIndexedSlot == null)
		throw new Error(`Helius: ${label} missing last_indexed_slot`)
	return BigInt(lastIndexedSlot)
}

const heliusTokenMintTimestampFields = (
	mint: {
		$network: NetworkId
		mintAddress: string
	},
	asset: DasAssetWire,
	slot: bigint,
) => ({
	[EntityMetaKey.Selector]: {
		$mint: mint,
		slot,
		source: Source.Helius,
	},
	$mint: {
		[EntityMetaKey.Selector]: mint,
	},
	slot,
	source: Source.Helius,
	...(asset.token_info != null && {
		supply: BigInt(asset.token_info.supply),
		decimals: asset.token_info.decimals,
		...(asset.token_info.mint_authority != null && {
			mintAuthorityPubkey: asset.token_info.mint_authority,
		}),
		...(asset.token_info.freeze_authority != null && {
			freezeAuthorityPubkey: asset.token_info.freeze_authority,
		}),
	}),
	isInitialized: !asset.burnt,
})

export default {
	source: Source.Helius,

	resolvers: [
		defineResolver({
			entityType: EntityType.SolanaTransaction,
			resolve: {
				NetworkSignature: {
					resolve: async (entitySelector, context) => {
						const transaction = await getTransaction(
							entitySelector,
							context
						)
						return {
							...heliusTransactionFields(
								entitySelector.$network,
								transaction
							),
							$$timestamps: [
								heliusTransactionTimestampFields(
									entitySelector,
									transaction
								),
							],
							$$instructions: heliusInstructionRows(
								entitySelector,
								transaction
							),
						}
					},
				},
			}
		})({
				$block: (transaction) => transaction.$block,
				$feePayer: (transaction) => transaction.$feePayer,
				$$timestamps: (transaction) => transaction.$$timestamps.map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: Object.fromEntries(
						Object.entries(timestamp).flatMap(([fieldName, value]) => (
							fieldName === EntityMetaKey.Selector || value == null ?
								[]
							:
								[[entityFieldAddressKey(EntityType.SolanaTransaction_Timestamp, [], fieldName), value]]
						))
					),
				})),
				$$instructions: (transaction) => transaction.$$instructions.map((instruction) => ({
					[EntityMetaKey.Selector]: instruction[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.SolanaInstruction, [], '$program')]: instruction.$program,
						...(instruction.data != null && {
							[entityFieldAddressKey(EntityType.SolanaInstruction, [], 'data')]: instruction.data,
						}),
						[entityFieldAddressKey(EntityType.SolanaInstruction, [], '$$accounts')]: instruction.$$accounts.map((account) => ({
							[EntityMetaKey.Selector]: account[EntityMetaKey.Selector],
						})),
					},
				})),
			}),

		defineResolver({
			entityType: EntityType.SolanaTransaction_Timestamp,
			resolve: {
				TransactionSlotSource: {
					resolve: async ({ $transaction, slot, source }, context) => {
						if (source !== Source.Helius) throw new Error(`Helius: unsupported source ${source}`)
						const transaction = await getTransaction(
							$transaction,
							context
						)
						if (BigInt(transaction.slot) !== slot) throw new Error('Helius: SolanaTransaction_Timestamp id does not match transaction slot')
						return heliusTransactionTimestampFields(
							$transaction,
							transaction
						)
					},
				},
			}
		})({
				$transaction: (timestamp) => timestamp.$transaction,
				slot: (timestamp) => timestamp.slot,
				source: (timestamp) => timestamp.source,
				timestampMs: (timestamp) => timestamp.timestampMs,
				feeLamports: (timestamp) => timestamp.feeLamports,
				status: (timestamp) => timestamp.status,
				err: (timestamp) => timestamp.err,
			}),

		defineResolver({
			entityType: EntityType.SolanaInstruction,
			resolve: {
				SolanaTransactionIndexInTransaction: {
					resolve: async ({ $transaction, indexInTransaction }, context) => {
						const transaction = await getTransaction(
							$transaction,
							context
						)
						const instruction = heliusInstructionRows(
							$transaction,
							transaction
						).find((instruction) => instruction[EntityMetaKey.Selector].indexInTransaction === indexInTransaction)
						if (instruction == null) throw new Error(`Helius: instruction not found for ${$transaction.signature}:${String(indexInTransaction)}`)
						return instruction
					},
				},
			}
		})({
					instructionKind: (instruction) => instruction[EntityMetaKey.Selector].instructionKind,
					indexInTransaction: (instruction) => instruction[EntityMetaKey.Selector].indexInTransaction,
				$program: (instruction) => instruction.$program,
				indexInInstruction: () => undefined,
				data: (instruction) => instruction.data,
				$$accounts: (instruction) => instruction.$$accounts,
			}),

		defineResolver({
			entityType: EntityType.SolanaTokenMint,
			resolve: {
				NetworkMintAddress: {
					resolve: async ({ $network, mintAddress }, context) => {
						assertSolanaMainnet($network)
						const asset = await getAsset({
							id: mintAddress,
							publicEnv: context.publicEnv,
						})
						if (asset.id !== mintAddress)
							throw new Error(`Helius: asset id ${asset.id} does not match mint ${mintAddress}`)
						const slot = requireIndexedSlot(
							asset.last_indexed_slot,
							'getAsset'
						)
						return {
							$$timestamps: [
								heliusTokenMintTimestampFields(
									{
										$network,
										mintAddress,
									},
									asset,
									slot
								),
							],
						}
					},
				},
			},
		})({
			$$timestamps: (mint) => mint.$$timestamps.map((timestamp) => ({
				[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				[EntityMetaKey.Fields]: Object.fromEntries(
					Object.entries(timestamp).flatMap(([fieldName, value]) => (
						fieldName === EntityMetaKey.Selector || value == null ?
							[]
						:
							[[entityFieldAddressKey(EntityType.SolanaTokenMint_Timestamp, [], fieldName), value]]
					))
				),
			})),
		}),

		defineResolver({
			entityType: EntityType.SolanaTokenMint_Timestamp,
			resolve: {
				MintSlotSource: {
					resolve: async ({ $mint, slot, source }, context) => {
						if (source !== Source.Helius) throw new Error(`Helius: unsupported source ${source}`)
						assertSolanaMainnet($mint.$network)
						const asset = await getAsset({
							id: $mint.mintAddress,
							publicEnv: context.publicEnv,
						})
						if (asset.id !== $mint.mintAddress)
							throw new Error(`Helius: asset id ${asset.id} does not match mint ${$mint.mintAddress}`)
						if (requireIndexedSlot(asset.last_indexed_slot, 'getAsset') !== slot)
							throw new Error('Helius: SolanaTokenMint_Timestamp id does not match last_indexed_slot')
						return heliusTokenMintTimestampFields(
							$mint,
							asset,
							slot
						)
					},
				},
			},
		})({
			$mint: (timestamp) => timestamp.$mint,
			slot: (timestamp) => timestamp.slot,
			source: (timestamp) => timestamp.source,
			supply: (timestamp) => timestamp.supply,
			decimals: (timestamp) => timestamp.decimals,
			isInitialized: (timestamp) => timestamp.isInitialized,
			mintAuthorityPubkey: (timestamp) => timestamp.mintAuthorityPubkey,
			freezeAuthorityPubkey: (timestamp) => timestamp.freezeAuthorityPubkey,
		}),

		defineResolver({
			entityType: EntityType.SolanaAccount,
			resolve: {
				NetworkPubkey: {
					resolve: async ({ $network, pubkey }, context) => {
						assertSolanaMainnet($network)
						const page = await getAssetsByOwner({
							ownerAddress: pubkey,
							limit: Math.min(resolverContextRowLimit(context), 1_000),
							publicEnv: context.publicEnv,
						})
						const slot = requireIndexedSlot(
							page.last_indexed_slot,
							'getAssetsByOwner'
						)
						// Owner DAS asset/NFT inventory page is loaded here. Enrolled SolanaAccount has no $$nfts /
						// $$tokenMints host field (orthogonal to Solana_JsonRpc $$tokenAccounts), so project the DAS
						// index clock onto $$timestamps and leave per-asset mint tips on SolanaTokenMint.getAsset.
						return {
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$account: {
											$network,
											pubkey,
										},
										slot,
										source: Source.Helius,
									},
								},
							],
						}
					},
				},
			},
		})({
			$$timestamps: (account) => account.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.SolanaAccount_Timestamp,
			resolve: {
				AccountSlotSource: {
					resolve: async ({ $account, slot, source }, context) => {
						if (source !== Source.Helius) throw new Error(`Helius: unsupported source ${source}`)
						assertSolanaMainnet($account.$network)
						const page = await getAssetsByOwner({
							ownerAddress: $account.pubkey,
							limit: 1,
							publicEnv: context.publicEnv,
						})
						if (requireIndexedSlot(page.last_indexed_slot, 'getAssetsByOwner') !== slot)
							throw new Error('Helius: SolanaAccount_Timestamp id does not match last_indexed_slot')
						return {
							$account: {
								[EntityMetaKey.Selector]: $account,
							},
							slot,
							source,
						}
					},
				},
			},
		})({
			$account: (timestamp) => timestamp.$account,
			slot: (timestamp) => timestamp.slot,
			source: (timestamp) => timestamp.source,
			lamports: () => undefined,
			$ownerProgram: () => undefined,
			rentEpoch: () => undefined,
			executable: () => undefined,
			dataEncoding: () => undefined,
		}),

	],
} satisfies RegisteredSourceResolverModule
