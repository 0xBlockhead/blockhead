import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { solanaMainnetRpcEndpoints } from '$/sources/Solana/index.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	SolanaRpcInstruction,
	SolanaRpcTransactionWithMeta,
	SolanaRpcVoteAccounts,
} from '$/sources/Solana/JsonRpc/types.ts'
import { SolanaBlockSelector } from '$/schema/SolanaBlock.ts'
import { SolanaNetwork_TimestampSelector } from '$/schema/SolanaNetwork_Timestamp.ts'
import { SolanaTransactionSelector } from '$/schema/SolanaTransaction.ts'
import { SolanaInstructionSelector } from '$/schema/SolanaInstruction.ts'
import { SolanaAccountSelector } from '$/schema/SolanaAccount.ts'
import { SolanaProgramSelector } from '$/schema/SolanaProgram.ts'
import { SolanaTokenMintSelector } from '$/schema/SolanaTokenMint.ts'
import { SolanaValidatorSelector } from '$/schema/SolanaValidator.ts'
import { SolanaNetworkSelector } from '$/schema/SolanaNetwork.ts'

const solanaMainnetRpcUrl = solanaMainnetRpcEndpoints[0].url
const solanaMainnetCaip2 = networkBySlug.solana.caip2

const assertSolanaMainnet = (network: { caip2: {
	namespace: string
	reference: string
} } | { slug: string }) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== solanaMainnetCaip2.namespace
		|| network.caip2.reference !== solanaMainnetCaip2.reference
	) {
		throw new Error('Solana_JsonRpc: unsupported network')
	}
}

const solanaTransactionFields = (
	network: { caip2: {
		namespace: string
		reference: string
	} } | { slug: string },
	transaction: SolanaRpcTransactionWithMeta,
	slot?: bigint
) => ({
	...(slot != null && {
		$block: {
			[EntityMetaKey.Selector]: {
				$network: network,
				slot,
			},
		},
		slot,
	}),
	...((feePayer) => (
		feePayer == null ?
			{}
		:
			{
				$feePayer: {
					[EntityMetaKey.Selector]: {
						$network: network,
						pubkey: feePayer.pubkey,
					},
				},
			}
	))(transaction.transaction.message.accountKeys.find((accountKey) => accountKey.signer)),
	...(transaction.meta != null && {
		feeLamports: BigInt(transaction.meta.fee),
		...(transaction.meta.computeUnitsConsumed != null && {
			computeUnitsConsumed: BigInt(transaction.meta.computeUnitsConsumed),
		}),
		status: transaction.meta.err == null ? 'success' : 'failed',
	}),
})

const solanaInstructionFields = (
	network: { caip2: {
		namespace: string
		reference: string
	} } | { slug: string },
	instruction: SolanaRpcInstruction
) => ({
	$program: {
		[EntityMetaKey.Selector]: {
			$network: network,
			programId: instruction.programId,
		},
	},
	...(instruction.parsed?.type != null && {
		parsedType: instruction.parsed.type,
	}),
	...(instruction.data != null && {
		data: instruction.data,
	}),
	$$accounts: (
		instruction.accounts?.map((pubkey) => ({
			[EntityMetaKey.Selector]: {
				$network: network,
				pubkey,
			},
		})) ?? []
	),
})

const solanaInstructionRows = (
	network: { caip2: {
		namespace: string
		reference: string
	} } | { slug: string },
	transactionId: {
		$network: { caip2: {
			namespace: string
			reference: string
		} } | { slug: string }
		signature: string
	},
	transaction: SolanaRpcTransactionWithMeta
) => [
	...transaction.transaction.message.instructions.map((instruction, instructionIndex) => ({
		[EntityMetaKey.Selector]: {
			$transaction: transactionId,
			instructionPath: [instructionIndex],
		},
		instructionIndex,
		...solanaInstructionFields(
			network,
			instruction
		),
	})),
	...(transaction.meta?.innerInstructions ?? [])
		.flatMap((innerInstructionGroup) => (
			innerInstructionGroup.instructions.map((instruction, innerInstructionIndex) => ({
				[EntityMetaKey.Selector]: {
					$transaction: transactionId,
					instructionPath: [
						innerInstructionGroup.index,
						innerInstructionIndex,
					],
				},
				instructionIndex: innerInstructionGroup.index,
				innerInstructionIndex,
				...solanaInstructionFields(
					network,
					instruction
				),
			}))
		)),
]

const getTransaction = async ({ $network, signature }: {
	$network: { caip2: {
		namespace: string
		reference: string
	} } | { slug: string }
	signature: string
}) => {
	assertSolanaMainnet($network)
	const { getTransaction } = await import('$/sources/Solana/JsonRpc/queries.ts')
	const transaction = await getTransaction({
		rpcUrl: solanaMainnetRpcUrl,
		signature: signature,
	})
	if (transaction == null) throw new Error(`Solana_JsonRpc: transaction not found for signature ${signature}`)
	return transaction
}

const solanaValidatorRows = (
	network: { caip2: {
		namespace: string
		reference: string
	} } | { slug: string },
	voteAccounts: SolanaRpcVoteAccounts
) => (
	[
		...voteAccounts.current.map((voteAccount) => ({
			[EntityMetaKey.Selector]: {
				$network: network,
				votePubkey: voteAccount.votePubkey,
			},
			nodePubkey: voteAccount.nodePubkey,
			activatedStakeLamports: BigInt(voteAccount.activatedStake),
			commission: voteAccount.commission,
			delinquent: false,
		})),
		...voteAccounts.delinquent.map((voteAccount) => ({
			[EntityMetaKey.Selector]: {
				$network: network,
				votePubkey: voteAccount.votePubkey,
			},
			nodePubkey: voteAccount.nodePubkey,
			activatedStakeLamports: BigInt(voteAccount.activatedStake),
			commission: voteAccount.commission,
			delinquent: true,
		})),
	]
)

export default {
	source: Source.Solana_JsonRpc,

	resolvers: [
		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaBlock,
			resolve: {
				[SolanaBlockSelector.Slot]: async ({ $network, slot }: {
					$network: { caip2: {
						namespace: string
						reference: string
					} } | { slug: string }
					slot: bigint
				}) => {
						assertSolanaMainnet($network)

						const { getBlock } = await import('$/sources/Solana/JsonRpc/queries.ts')
						const block = await getBlock({
							rpcUrl: solanaMainnetRpcUrl,
							slot,
						})
						if (block == null) throw new Error(`Solana_JsonRpc: block not found for slot ${slot.toString()}`)
						return {
							...(block.blockHeight != null && {
								blockHeight: BigInt(block.blockHeight),
							}),
							blockHash: block.blockhash,
							previousBlockHash: block.previousBlockhash,
							$parent: {
								[EntityMetaKey.Selector]: {
									$network,
									slot: BigInt(block.parentSlot),
								},
							},
							parentSlot: BigInt(block.parentSlot),
							...(block.blockTime != null && {
								timestampMs: block.blockTime * 1000,
							}),
							transactionCount: block.transactions.length,
							$$transactions: block.transactions.flatMap((transaction) => {
								const signature = transaction.transaction.signatures.at(0)
								return signature == null ?
									[]
								:
									[
										{
											[EntityMetaKey.Selector]: {
												$network,
												signature,
											},
											...solanaTransactionFields(
												$network,
												transaction,
												slot
										),
										},
									]
							}),
						}
				},
			},
		})({
			fields: {
				blockHeight: (block) => block.blockHeight,
				blockHash: (block) => block.blockHash,
				previousBlockHash: (block) => block.previousBlockHash,
				$parent: (block) => block.$parent,
				parentSlot: (block) => block.parentSlot,
				timestampMs: (block) => block.timestampMs,
				transactionCount: (block) => block.transactionCount,
				$$transactions: (block) => block.$$transactions,
			},
		}),
		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaNetwork_Timestamp,
			resolve: {
				[SolanaNetwork_TimestampSelector.SolanaNetworkTimestampMs]: async ({ $network }) => {
					assertSolanaMainnet($network)
					const {
						getEpochInfo,
						getHealth,
						getVersion,
						getVoteAccounts,
					} = await import('$/sources/Solana/JsonRpc/queries.ts')
					const [
						epochInfo,
					health,
					version,
					voteAccounts,
					] = await Promise.all([
						getEpochInfo({
							rpcUrl: solanaMainnetRpcUrl,
						}),
						getHealth({
							rpcUrl: solanaMainnetRpcUrl,
						}).catch((error) => (
						error instanceof Error ? error.message : 'unavailable'
						)),
						getVersion({
							rpcUrl: solanaMainnetRpcUrl,
						}),
						getVoteAccounts({
							rpcUrl: solanaMainnetRpcUrl,
						}),
					])
					return {
						absoluteSlot: BigInt(epochInfo.absoluteSlot),
						blockHeight: BigInt(epochInfo.blockHeight),
						epoch: epochInfo.epoch,
						slotIndex: epochInfo.slotIndex,
						slotsInEpoch: epochInfo.slotsInEpoch,
						...(epochInfo.transactionCount != null && {
							transactionCount: BigInt(epochInfo.transactionCount),
						}),
						currentValidatorCount: voteAccounts.current.length,
						delinquentValidatorCount: voteAccounts.delinquent.length,
						totalActivatedStakeLamports: voteAccounts.current
							.reduce((total, voteAccount) => total + BigInt(voteAccount.activatedStake), 0n),
						solanaCoreVersion: version['solana-core'],
						...(version['feature-set'] != null && {
							featureSet: version['feature-set'],
						}),
						health,
					}
				}
			},
		})({
			fields: {
				absoluteSlot: (timestamp) => timestamp.absoluteSlot,
				blockHeight: (timestamp) => timestamp.blockHeight,
				epoch: (timestamp) => timestamp.epoch,
				slotIndex: (timestamp) => timestamp.slotIndex,
				slotsInEpoch: (timestamp) => timestamp.slotsInEpoch,
				transactionCount: (timestamp) => timestamp.transactionCount,
				currentValidatorCount: (timestamp) => timestamp.currentValidatorCount,
				delinquentValidatorCount: (timestamp) => timestamp.delinquentValidatorCount,
				totalActivatedStakeLamports: (timestamp) => timestamp.totalActivatedStakeLamports,
				solanaCoreVersion: (timestamp) => timestamp.solanaCoreVersion,
				featureSet: (timestamp) => timestamp.featureSet,
				health: (timestamp) => timestamp.health,
			},
		}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaTransaction,
			resolve: {
				[SolanaTransactionSelector.NetworkSignature]: async ({ $network, signature }) => {
					const transaction = await getTransaction({
						$network,
						signature,
					})
					return {
						...solanaTransactionFields(
							$network,
							transaction,
							BigInt(transaction.slot)
						),
						$$instructions: solanaInstructionRows(
							$network,
							{
								$network,
								signature,
							},
							transaction
						),
					}
				},
			},
		})({
			fields: {
				$block: (transaction) => transaction.$block,
				$feePayer: (transaction) => transaction.$feePayer,
				slot: (transaction) => transaction.slot,
				feeLamports: (transaction) => transaction.feeLamports,
				computeUnitsConsumed: (transaction) => transaction.computeUnitsConsumed,
				status: (transaction) => transaction.status,
				$$instructions: (transaction) => transaction.$$instructions.map((instruction) => ({
					[EntityMetaKey.Selector]: instruction[EntityMetaKey.Selector],
				})),
			},
		}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaInstruction,
			resolve: {
				[SolanaInstructionSelector.SolanaTransactionInstructionPath]: async ({ $transaction, instructionPath }) => {
					const transaction = await getTransaction($transaction)
					const instruction = (
						instructionPath.length === 1 ?
							transaction.transaction.message.instructions[instructionPath[0]]
						:
							transaction.meta?.innerInstructions
								?.find((innerInstructionGroup) => innerInstructionGroup.index === instructionPath[0])
								?.instructions[instructionPath[1]]
					)
					if (instruction == null) throw new Error(`Solana_JsonRpc: instruction not found for ${$transaction.signature}`)
					return solanaInstructionFields(
						$transaction.$network,
						instruction
					)
				},
			},
		})({
			fields: {
				$program: (instruction) => instruction.$program,
				parsedType: (instruction) => instruction.parsedType,
				data: (instruction) => instruction.data,
				$$accounts: (instruction) => instruction.$$accounts,
			},
		}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaAccount,
			resolve: {
				[SolanaAccountSelector.NetworkPubkey]: async ({ $network, pubkey }) => {
					assertSolanaMainnet($network)
					const { getAccountInfo } = await import('$/sources/Solana/JsonRpc/queries.ts')
					const accountInfo = await getAccountInfo({
						rpcUrl: solanaMainnetRpcUrl,
						pubkey: pubkey,
					})
					if (accountInfo.value == null) throw new Error(`Solana_JsonRpc: account not found for pubkey ${pubkey}`)
					return {
						$ownerProgram: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								programId: accountInfo.value.owner,
							},
						},
						lamports: BigInt(accountInfo.value.lamports),
						rentEpoch: BigInt(accountInfo.value.rentEpoch),
						executable: accountInfo.value.executable,
						dataEncoding: accountInfo.value.data[1],
					}
				}
			},
		})({
			fields: {
				$ownerProgram: (account) => account.$ownerProgram,
				lamports: (account) => account.lamports,
				rentEpoch: (account) => account.rentEpoch,
				executable: (account) => account.executable,
				dataEncoding: (account) => account.dataEncoding,
			},
		}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaProgram,
			resolve: {
				[SolanaProgramSelector.NetworkProgramId]: async ({ $network, programId }) => {
					assertSolanaMainnet($network)
					return {
						$programAccount: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								pubkey: programId,
							},
						},
					}
				}
			},
		})({
			fields: {
				$programAccount: (program) => program.$programAccount,
			},
		}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaTokenMint,
			resolve: {
				[SolanaTokenMintSelector.NetworkMintAddress]: async ({ $network, mintAddress }) => {
					assertSolanaMainnet($network)
					const { getParsedTokenMintAccountInfo } = await import('$/sources/Solana/JsonRpc/queries.ts')
					const accountInfo = await getParsedTokenMintAccountInfo({
						rpcUrl: solanaMainnetRpcUrl,
						pubkey: mintAddress,
					})
					if (accountInfo.value == null) throw new Error(`Solana_JsonRpc: token mint not found for address ${mintAddress}`)
					return {
						supply: BigInt(accountInfo.value.data.parsed.info.supply),
						decimals: accountInfo.value.data.parsed.info.decimals,
						...(accountInfo.value.data.parsed.info.mintAuthority != null && {
							$mintAuthority: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									pubkey: accountInfo.value.data.parsed.info.mintAuthority,
								},
							},
						}),
						...(accountInfo.value.data.parsed.info.freezeAuthority != null && {
							$freezeAuthority: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									pubkey: accountInfo.value.data.parsed.info.freezeAuthority,
								},
							},
						}),
					}
				}
			},
		})({
			fields: {
				supply: (mint) => mint.supply,
				decimals: (mint) => mint.decimals,
				$mintAuthority: (mint) => mint.$mintAuthority,
				$freezeAuthority: (mint) => mint.$freezeAuthority,
			},
		}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaValidator,
			resolve: {
				[SolanaValidatorSelector.NetworkVotePubkey]: async ({ $network, votePubkey }) => {
					assertSolanaMainnet($network)
					const { getVoteAccounts } = await import('$/sources/Solana/JsonRpc/queries.ts')
					const voteAccounts = await getVoteAccounts({
						rpcUrl: solanaMainnetRpcUrl,
						votePubkey: votePubkey,
					})
					const currentVoteAccount = voteAccounts.current.find((voteAccount) => (
						voteAccount.votePubkey === votePubkey
					))
					const delinquentVoteAccount = voteAccounts.delinquent.find((voteAccount) => (
						voteAccount.votePubkey === votePubkey
					))
					const voteAccount = currentVoteAccount ?? delinquentVoteAccount
					if (voteAccount == null) throw new Error(`Solana_JsonRpc: validator vote account not found for ${votePubkey}`)
					return {
						nodePubkey: voteAccount.nodePubkey,
						activatedStakeLamports: BigInt(voteAccount.activatedStake),
						commission: voteAccount.commission,
						delinquent: delinquentVoteAccount != null,
					}
				}
			},
		})({
			fields: {
				nodePubkey: (validator) => validator.nodePubkey,
				activatedStakeLamports: (validator) => validator.activatedStakeLamports,
				commission: (validator) => validator.commission,
				delinquent: (validator) => validator.delinquent,
			},
		}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaNetwork,
			resolve: {
				[SolanaNetworkSelector.Caip2]: async ({ caip2 }) => {
					assertSolanaMainnet({ caip2 })
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: { caip2 },
								timestampMs: Date.now(),
							},
						},
					]
				}
			},
		})({
			fields: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaNetwork,
			resolve: {
				[SolanaNetworkSelector.Caip2]: async ({ caip2 }, context) => {
					assertSolanaMainnet({ caip2 })
					const {
						getBlocks,
						getSlot,
					} = await import('$/sources/Solana/JsonRpc/queries.ts')
					const limit = resolverContextRowLimit(context)
					const endSlot = BigInt(await getSlot({
						rpcUrl: solanaMainnetRpcUrl,
					}))
					return (await getBlocks({
						rpcUrl: solanaMainnetRpcUrl,
						startSlot: endSlot > BigInt(limit - 1) ?
							endSlot - BigInt(limit - 1)
						:
							0n,
						endSlot,
					}))
						.toReversed()
						.slice(0, limit)
						.map((slot) => ({
							[EntityMetaKey.Selector]: {
								$network: { caip2 },
								slot: BigInt(slot),
							},
						}))
				}
			},
		})({
			fields: {
				$$blocks: (blocks) => blocks,
			},
		}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaNetwork,
			resolve: {
				[SolanaNetworkSelector.Caip2]: async ({ caip2 }) => {
					assertSolanaMainnet({ caip2 })
					const { getVoteAccounts } = await import('$/sources/Solana/JsonRpc/queries.ts')
					return solanaValidatorRows(
						{ caip2 },
						await getVoteAccounts({
							rpcUrl: solanaMainnetRpcUrl,
						})
					)
				}
			},
		})({
			fields: {
				$$validators: (validators) => validators,
			},
		}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaNetwork,
			resolve: {
				[SolanaNetworkSelector.Caip2]: async ({ caip2 }, context) => {
					assertSolanaMainnet({ caip2 })
					const {
						getBlock,
						getBlocks,
						getSlot,
					} = await import('$/sources/Solana/JsonRpc/queries.ts')
					const limit = resolverContextRowLimit(context)
					const endSlot = BigInt(await getSlot({
						rpcUrl: solanaMainnetRpcUrl,
					}))
					return (
						await Promise.all(
							(await getBlocks({
								rpcUrl: solanaMainnetRpcUrl,
								startSlot: endSlot > 31n ? endSlot - 31n : 0n,
								endSlot,
							}))
								.toReversed()
								.map(async (slot) => ({
									slot: BigInt(slot),
									block: await getBlock({
										rpcUrl: solanaMainnetRpcUrl,
										slot: BigInt(slot),
									}),
								}))
					)
					)
						.flatMap(({ block, slot }) => (
						block?.transactions.flatMap((transaction) => {
								const signature = transaction.transaction.signatures.at(0)
								return signature == null ?
									[]
								:
									[
										{
											[EntityMetaKey.Selector]: {
												$network: { caip2 },
												signature,
											},
											...solanaTransactionFields(
												{ caip2 },
												transaction,
												slot
										),
										},
									]
						}) ?? []
						))
						.slice(0, limit)
				}
			},
		})({
			fields: {
				$$transactions: (transactions) => transactions,
			},
		}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaNetwork,
			resolve: {
				[SolanaNetworkSelector.Caip2]: async ({ caip2 }, context) => {
					assertSolanaMainnet({ caip2 })
					const {
						getBlock,
						getBlocks,
						getSlot,
					} = await import('$/sources/Solana/JsonRpc/queries.ts')
					const limit = resolverContextRowLimit(context)
					const endSlot = BigInt(await getSlot({
						rpcUrl: solanaMainnetRpcUrl,
					}))
					return [
						...new Set(
							(
							await Promise.all(
								(await getBlocks({
									rpcUrl: solanaMainnetRpcUrl,
									startSlot: endSlot > 31n ? endSlot - 31n : 0n,
									endSlot,
								}))
									.toReversed()
									.map(async (slot) => (
										(await getBlock({
											rpcUrl: solanaMainnetRpcUrl,
											slot: BigInt(slot),
										}))?.transactions
											.flatMap((transaction) => (
												transaction.transaction.message.accountKeys.map((accountKey) => accountKey.pubkey)
											))
											?? []
									))
							)
							).flat()
					),
					]
						.slice(0, limit)
						.map((pubkey) => ({
							[EntityMetaKey.Selector]: {
								$network: { caip2 },
								pubkey,
							},
						}))
				}
			},
		})({
			fields: {
				$$accounts: (accounts) => accounts,
			},
		}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaBlock,
			resolve: {
				[SolanaBlockSelector.Slot]: async ({ $network, slot }: {
					$network: { caip2: {
						namespace: string
						reference: string
					} } | { slug: string }
					slot: bigint
				}) => {
						assertSolanaMainnet($network)

						const { getBlock } = await import('$/sources/Solana/JsonRpc/queries.ts')
						const block = await getBlock({
							rpcUrl: solanaMainnetRpcUrl,
							slot,
						})
						if (block == null) throw new Error(`Solana_JsonRpc: block not found for slot ${slot.toString()}`)
						return block.transactions.flatMap((transaction) => {
							const signature = transaction.transaction.signatures.at(0)
							return signature == null ?
								[]
							:
								[
									{
										[EntityMetaKey.Selector]: {
											$network,
											signature,
										},
										...solanaTransactionFields(
											$network,
											transaction,
											slot
									),
									},
								]
						})
				},
			},
		})({
			fields: {
				$$transactions: (transactions) => transactions,
			},
		}),
		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaTransaction,
			resolve: {
				[SolanaTransactionSelector.NetworkSignature]: async ({ $network, signature }) => (
					solanaInstructionRows(
						$network,
						{
							$network,
							signature,
						},
						await getTransaction({
							$network,
							signature,
						})
					)
				)
			},
		})({
			fields: {
				$$instructions: (instructions) => instructions.map((instruction) => ({
					[EntityMetaKey.Selector]: instruction[EntityMetaKey.Selector],
				})),
			},
		}),
	],
}
