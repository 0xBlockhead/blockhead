import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
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
import { NetworkSelector } from '$/schema/Network.ts'
import { Network_TimestampSelector } from '$/schema/Network_Timestamp.ts'
import { SolanaBlockSelector } from '$/schema/SolanaBlock.ts'
import { SolanaTransactionSelector } from '$/schema/SolanaTransaction.ts'
import { SolanaTransaction_TimestampSelector } from '$/schema/SolanaTransaction_Timestamp.ts'
import { SolanaInstructionKind, SolanaInstructionSelector } from '$/schema/SolanaInstruction.ts'
import { SolanaAccountSelector } from '$/schema/SolanaAccount.ts'
import { SolanaAccount_TimestampSelector } from '$/schema/SolanaAccount_Timestamp.ts'
import { SolanaProgramSelector } from '$/schema/SolanaProgram.ts'
import { SolanaTokenMintSelector } from '$/schema/SolanaTokenMint.ts'
import { SolanaTokenMint_TimestampSelector } from '$/schema/SolanaTokenMint_Timestamp.ts'
import { SolanaTokenAccountSelector } from '$/schema/SolanaTokenAccount.ts'
import { SolanaTokenAccount_TimestampSelector } from '$/schema/SolanaTokenAccount_Timestamp.ts'
import { SolanaValidatorSelector } from '$/schema/SolanaValidator.ts'
import { SolanaValidator_TimestampSelector } from '$/schema/SolanaValidator_Timestamp.ts'
import type { Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'

const solanaMainnetCaip2 = networkBySlug.solana.caip2

const solanaMainnetRpcUrl = async () => (
	(await import('$/sources/Solana/JsonRpc/queries.ts')).solanaMainnetRpcEndpoints[0].url
)

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
})

const solanaTransactionTimestampFields = (
	transactionId: {
		$network: { caip2: {
			namespace: string
			reference: string
		} } | { slug: string }
		signature: string
	},
	transaction: SolanaRpcTransactionWithMeta & {
		blockTime?: number
	},
	slot: bigint
) => ({
	[EntityMetaKey.Selector]: {
		$transaction: transactionId,
		slot,
		source: Source.Solana_JsonRpc,
	},
	$transaction: {
		[EntityMetaKey.Selector]: transactionId,
	},
	slot,
	source: Source.Solana_JsonRpc,
	...(transaction.blockTime != null && {
		timestampMs: transaction.blockTime * 1000,
	}),
	...(transaction.meta != null && {
		feeLamports: BigInt(transaction.meta.fee),
		...(transaction.meta.computeUnitsConsumed != null && {
			computeUnitsConsumed: BigInt(transaction.meta.computeUnitsConsumed),
		}),
		status: transaction.meta.err == null ? 'success' : 'failed',
		...(transaction.meta.err != null && {
			err: transaction.meta.err,
		}),
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
	...(instruction.stackHeight != null && {
		stackHeight: instruction.stackHeight,
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
	...transaction.transaction.message.instructions.map((instruction, indexInTransaction) => ({
		[EntityMetaKey.Selector]: {
			$transaction: transactionId,
			instructionKind: SolanaInstructionKind.Instruction,
			indexInTransaction,
		},
		...solanaInstructionFields(
			network,
			instruction
		),
	})),
	...(transaction.meta?.innerInstructions ?? [])
		.flatMap((innerInstructionGroup) => (
			innerInstructionGroup.instructions.map((instruction, indexInInstruction) => ({
				[EntityMetaKey.Selector]: {
					$transaction: transactionId,
					instructionKind: SolanaInstructionKind.InnerInstruction,
					indexInTransaction: innerInstructionGroup.index,
					indexInInstruction,
				},
				...solanaInstructionFields(
					network,
					instruction
				),
			}))
		)),
]

const solanaAccountTimestampFields = (
	accountId: {
		$network: { caip2: {
			namespace: string
			reference: string
		} } | { slug: string }
		pubkey: string
	},
	accountInfo: {
		lamports: number
		owner: string
		executable: boolean
		rentEpoch: number
		data: [string, string]
	},
	slot: bigint
) => ({
	[EntityMetaKey.Selector]: {
		$account: accountId,
		slot,
		source: Source.Solana_JsonRpc,
	},
	$account: {
		[EntityMetaKey.Selector]: accountId,
	},
	slot,
	source: Source.Solana_JsonRpc,
	lamports: BigInt(accountInfo.lamports),
	ownerProgramId: accountInfo.owner,
	rentEpoch: BigInt(accountInfo.rentEpoch),
	executable: accountInfo.executable,
	dataEncoding: accountInfo.data[1],
})

const solanaValidatorTimestampFields = (
	validatorId: {
		$network: { caip2: {
			namespace: string
			reference: string
		} } | { slug: string }
		votePubkey: string
	},
	voteAccount: {
		activatedStake: number
		commission: number
		lastVote: number
		rootSlot: number
	},
	slot: bigint,
	delinquent: boolean
) => ({
	[EntityMetaKey.Selector]: {
		$validator: validatorId,
		slot,
		source: Source.Solana_JsonRpc,
	},
	$validator: {
		[EntityMetaKey.Selector]: validatorId,
	},
	slot,
	source: Source.Solana_JsonRpc,
	activatedStakeLamports: BigInt(voteAccount.activatedStake),
	commission: voteAccount.commission,
	delinquent,
	lastVoteSlot: BigInt(voteAccount.lastVote),
	rootSlot: BigInt(voteAccount.rootSlot),
	epochCredits: voteAccount.epochCredits,
})

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
		rpcUrl: await solanaMainnetRpcUrl(),
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
	voteAccounts: SolanaRpcVoteAccounts,
	slot: bigint
) => (
	[
		...voteAccounts.current.map((voteAccount) => ({
			[EntityMetaKey.Selector]: {
				$network: network,
				votePubkey: voteAccount.votePubkey,
			},
			nodePubkey: voteAccount.nodePubkey,
			$$timestamps: [
				solanaValidatorTimestampFields(
					{
						$network: network,
						votePubkey: voteAccount.votePubkey,
					},
					voteAccount,
					slot,
					false
				),
			],
		})),
		...voteAccounts.delinquent.map((voteAccount) => ({
			[EntityMetaKey.Selector]: {
				$network: network,
				votePubkey: voteAccount.votePubkey,
			},
			nodePubkey: voteAccount.nodePubkey,
			$$timestamps: [
				solanaValidatorTimestampFields(
					{
						$network: network,
						votePubkey: voteAccount.votePubkey,
					},
					voteAccount,
					slot,
					true
				),
			],
		})),
	]
)

const solanaTokenAccountTimestampFields = (
	tokenAccount: {
		$network: { caip2: {
			namespace: string
			reference: string
		} } | { slug: string }
		tokenAccountPubkey: string
	},
	info: {
		mint: string
		owner: string
		tokenAmount: {
			amount: string
			decimals: number
			uiAmountString?: string
		}
		state?: string
		isNative?: boolean
		delegate?: string
		delegatedAmount?: {
			amount: string
		}
		rentExemptReserve?: {
			amount: string
		}
		closeAuthority?: string
	},
	slot: bigint
) => ({
	[EntityMetaKey.Selector]: {
		$tokenAccount: tokenAccount,
		slot,
		source: Source.Solana_JsonRpc,
	},
	$tokenAccount: {
		[EntityMetaKey.Selector]: tokenAccount,
	} satisfies Entity<typeof schema, EntityType.SolanaTokenAccount>,
	slot,
	source: Source.Solana_JsonRpc,
	amount: BigInt(info.tokenAmount.amount),
	decimals: info.tokenAmount.decimals,
	uiAmountString: info.tokenAmount.uiAmountString,
	state: info.state,
	isNative: info.isNative,
	ownerPubkey: info.owner,
	mintAddress: info.mint,
	delegatePubkey: info.delegate,
	closeAuthorityPubkey: info.closeAuthority,
	...(info.delegatedAmount != null && {
		delegatedAmount: BigInt(info.delegatedAmount.amount),
	}),
	...(info.rentExemptReserve != null && {
		rentExemptReserveLamports: BigInt(info.rentExemptReserve.amount),
	}),
})

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
							rpcUrl: await solanaMainnetRpcUrl(),
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
											$$timestamps: [
												solanaTransactionTimestampFields(
													{
														$network,
														signature,
													},
													transaction,
													slot
												),
											],
										},
									]
							}),
						}
				},
			},
		})({
				blockHeight: (block) => block.blockHeight,
				blockHash: (block) => block.blockHash,
				previousBlockHash: (block) => block.previousBlockHash,
				$parent: (block) => block.$parent,
				parentSlot: (block) => block.parentSlot,
				timestampMs: (block) => block.timestampMs,
				transactionCount: (block) => block.transactionCount,
				$$transactions: (block) => block.$$transactions,
			}),
		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.Network_Timestamp,
			resolve: {
				[Network_TimestampSelector.NetworkTimestampMsSource]: async ({ $network, timestampMs, source }) => {
					if (source !== Source.Solana_JsonRpc) throw new Error(`Solana_JsonRpc: unsupported source ${source}`)
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
							rpcUrl: await solanaMainnetRpcUrl(),
						}),
						getHealth({
							rpcUrl: await solanaMainnetRpcUrl(),
						}).catch((error) => (
						error instanceof Error ? error.message : 'unavailable'
						)),
						getVersion({
							rpcUrl: await solanaMainnetRpcUrl(),
						}),
						getVoteAccounts({
							rpcUrl: await solanaMainnetRpcUrl(),
						}),
					])
					return {
						timestampMs,
						source: Source.Solana_JsonRpc,
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
				absoluteSlot: (timestamp) => timestamp.absoluteSlot,
				timestampMs: (timestamp) => timestamp.timestampMs,
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
				source: (timestamp) => timestamp.source,
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
						$$timestamps: [
							solanaTransactionTimestampFields(
								{
									$network,
									signature,
								},
								transaction,
								BigInt(transaction.slot)
							),
						],
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
				$block: (transaction) => transaction.$block,
				$feePayer: (transaction) => transaction.$feePayer,
				$$timestamps: (transaction) => transaction.$$timestamps.map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				})),
				$$instructions: (transaction) => transaction.$$instructions.map((instruction) => ({
					[EntityMetaKey.Selector]: instruction[EntityMetaKey.Selector],
				})),
			}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaTransaction_Timestamp,
			resolve: {
				[SolanaTransaction_TimestampSelector.TransactionSlotSource]: async ({ $transaction, slot, source }) => {
					if (source !== Source.Solana_JsonRpc) throw new Error(`Solana_JsonRpc: unsupported source ${source}`)
					const transaction = await getTransaction($transaction)
					if (BigInt(transaction.slot) !== slot) throw new Error('Solana_JsonRpc: SolanaTransaction_Timestamp id does not match transaction slot')
					const { getSignatureStatuses } = await import('$/sources/Solana/JsonRpc/queries.ts')
					return {
						...solanaTransactionTimestampFields(
							$transaction,
							transaction,
							slot
						),
						confirmationStatus: (await getSignatureStatuses({
							rpcUrl: await solanaMainnetRpcUrl(),
							signatures: [$transaction.signature],
						})).value[0]?.confirmationStatus,
					}
				},
			},
		})({
				$transaction: (timestamp) => timestamp.$transaction,
				slot: (timestamp) => timestamp.slot,
				source: (timestamp) => timestamp.source,
				timestampMs: (timestamp) => timestamp.timestampMs,
				feeLamports: (timestamp) => timestamp.feeLamports,
				computeUnitsConsumed: (timestamp) => timestamp.computeUnitsConsumed,
				status: (timestamp) => timestamp.status,
				confirmationStatus: (timestamp) => timestamp.confirmationStatus,
				err: (timestamp) => timestamp.err,
			}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaInstruction,
			resolve: {
				[SolanaInstructionSelector.SolanaTransactionIndexInTransaction]: async ({ $transaction, indexInTransaction }) => {
					const transaction = await getTransaction($transaction)
					return {
						instructionKind: SolanaInstructionKind.Instruction,
						indexInTransaction,
						...solanaInstructionFields(
							$transaction.$network,
							transaction.transaction.message.instructions[indexInTransaction]
						),
					}
				},
				[SolanaInstructionSelector.SolanaTransactionIndexInInstruction]: async ({ $transaction, indexInTransaction, indexInInstruction }) => {
					const transaction = await getTransaction($transaction)
					const instruction = transaction.meta?.innerInstructions
						?.find((innerInstructionGroup) => innerInstructionGroup.index === indexInTransaction)
						?.instructions[indexInInstruction]
					if (instruction == null) throw new Error(`Solana_JsonRpc: instruction not found for ${$transaction.signature}`)
					return {
						instructionKind: SolanaInstructionKind.InnerInstruction,
						indexInTransaction,
						indexInInstruction,
						...solanaInstructionFields(
							$transaction.$network,
							instruction
						),
					}
				},
			},
		})({
				instructionKind: (instruction) => instruction.instructionKind,
				indexInTransaction: (instruction) => instruction.indexInTransaction,
				indexInInstruction: (instruction) => (
					'indexInInstruction' in instruction ?
						instruction.indexInInstruction
					:
						undefined
				),
				$program: (instruction) => instruction.$program,
				parsedType: (instruction) => instruction.parsedType,
				data: (instruction) => instruction.data,
				stackHeight: (instruction) => instruction.stackHeight,
				$$accounts: (instruction) => instruction.$$accounts,
			}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaAccount,
			resolve: {
				[SolanaAccountSelector.NetworkPubkey]: async ({ $network, pubkey }) => {
					assertSolanaMainnet($network)
					const { getAccountInfo, getSlot } = await import('$/sources/Solana/JsonRpc/queries.ts')
					const accountInfo = await getAccountInfo({
						rpcUrl: await solanaMainnetRpcUrl(),
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
						$$timestamps: [
							solanaAccountTimestampFields(
								{
									$network,
									pubkey,
								},
								accountInfo.value,
								BigInt(await getSlot({
									rpcUrl: await solanaMainnetRpcUrl(),
								}))
							),
						],
					}
				}
			},
		})({
				$ownerProgram: (account) => account.$ownerProgram,
				$$timestamps: (account) => account.$$timestamps.map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				})),
			}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaAccount_Timestamp,
			resolve: {
				[SolanaAccount_TimestampSelector.AccountSlotSource]: async ({ $account, slot, source }) => {
					if (source !== Source.Solana_JsonRpc) throw new Error(`Solana_JsonRpc: unsupported source ${source}`)
					assertSolanaMainnet($account.$network)
					const { getAccountInfo } = await import('$/sources/Solana/JsonRpc/queries.ts')
					const accountInfo = await getAccountInfo({
						rpcUrl: await solanaMainnetRpcUrl(),
						pubkey: $account.pubkey,
					})
					if (accountInfo.value == null) throw new Error(`Solana_JsonRpc: account not found for pubkey ${$account.pubkey}`)
					return solanaAccountTimestampFields(
						$account,
						accountInfo.value,
						slot
					)
				},
			},
		})({
				$account: (timestamp) => timestamp.$account,
				slot: (timestamp) => timestamp.slot,
				source: (timestamp) => timestamp.source,
				lamports: (timestamp) => timestamp.lamports,
				ownerProgramId: (timestamp) => timestamp.ownerProgramId,
				rentEpoch: (timestamp) => timestamp.rentEpoch,
				executable: (timestamp) => timestamp.executable,
				dataEncoding: (timestamp) => timestamp.dataEncoding,
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
				$programAccount: (program) => program.$programAccount,
			}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaTokenMint,
			resolve: {
				[SolanaTokenMintSelector.NetworkMintAddress]: async ({ $network, mintAddress }) => {
					assertSolanaMainnet($network)
					const { getParsedTokenMintAccountInfo, getSlot } = await import('$/sources/Solana/JsonRpc/queries.ts')
					const accountInfo = await getParsedTokenMintAccountInfo({
						rpcUrl: await solanaMainnetRpcUrl(),
						pubkey: mintAddress,
					})
					if (accountInfo.value == null) throw new Error(`Solana_JsonRpc: token mint not found for address ${mintAddress}`)
					return {
						$$timestamps: [
							{
								[EntityMetaKey.Selector]: {
									$mint: {
										$network,
										mintAddress,
									},
									slot: BigInt(await getSlot({
										rpcUrl: await solanaMainnetRpcUrl(),
									})),
									source: Source.Solana_JsonRpc,
								},
							},
						],
					}
				}
			},
		})({
				$$timestamps: (mint) => mint.$$timestamps,
			}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaTokenMint_Timestamp,
			resolve: {
				[SolanaTokenMint_TimestampSelector.MintSlotSource]: async ({ $mint, slot, source }) => {
					if (source !== Source.Solana_JsonRpc) throw new Error(`Solana_JsonRpc: unsupported source ${source}`)
					assertSolanaMainnet($mint.$network)
					const { getParsedTokenMintAccountInfo } = await import('$/sources/Solana/JsonRpc/queries.ts')
					const accountInfo = await getParsedTokenMintAccountInfo({
						rpcUrl: await solanaMainnetRpcUrl(),
						pubkey: $mint.mintAddress,
					})
					if (accountInfo.value == null) throw new Error(`Solana_JsonRpc: token mint not found for address ${$mint.mintAddress}`)
					return {
						$mint: {
							[EntityMetaKey.Selector]: $mint,
						},
						slot,
						source,
						supply: BigInt(accountInfo.value.data.parsed.info.supply),
						decimals: accountInfo.value.data.parsed.info.decimals,
						isInitialized: accountInfo.value.data.parsed.info.isInitialized,
						mintAuthorityPubkey: accountInfo.value.data.parsed.info.mintAuthority ?? undefined,
						freezeAuthorityPubkey: accountInfo.value.data.parsed.info.freezeAuthority ?? undefined,
					}
				}
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

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaTokenAccount,
			resolve: {
				[SolanaTokenAccountSelector.NetworkTokenAccountPubkey]: async ({ $network, tokenAccountPubkey }) => {
					assertSolanaMainnet($network)
					const { getParsedTokenAccountInfo, getSlot } = await import('$/sources/Solana/JsonRpc/queries.ts')
					const accountInfo = await getParsedTokenAccountInfo({
						rpcUrl: await solanaMainnetRpcUrl(),
						pubkey: tokenAccountPubkey,
					})
					if (accountInfo.value == null) throw new Error(`Solana_JsonRpc: token account not found for address ${tokenAccountPubkey}`)
					const info = accountInfo.value.data.parsed.info
					return {
						$account: {
							[EntityMetaKey.Selector]: {
								$network,
								pubkey: tokenAccountPubkey,
							},
						},
						$mint: {
							[EntityMetaKey.Selector]: {
								$network,
								mintAddress: info.mint,
							},
						},
						$owner: {
							[EntityMetaKey.Selector]: {
								$network,
								pubkey: info.owner,
							},
						},
						...(info.delegate != null && {
							$delegate: {
								[EntityMetaKey.Selector]: {
									$network,
									pubkey: info.delegate,
								},
							},
						}),
						...(info.closeAuthority != null && {
							$closeAuthority: {
								[EntityMetaKey.Selector]: {
									$network,
									pubkey: info.closeAuthority,
								},
							},
						}),
						$$timestamps: [
							{
								[EntityMetaKey.Selector]: {
									$tokenAccount: {
										$network,
										tokenAccountPubkey,
									},
									slot: BigInt(await getSlot({
										rpcUrl: await solanaMainnetRpcUrl(),
									})),
									source: Source.Solana_JsonRpc,
								},
							},
						],
					}
				}
			},
		})({
				$account: (account) => account.$account,
				$mint: (account) => account.$mint,
				$owner: (account) => account.$owner,
				$delegate: (account) => account.$delegate,
				$closeAuthority: (account) => account.$closeAuthority,
				$$timestamps: (account) => account.$$timestamps,
			}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaTokenAccount_Timestamp,
			resolve: {
				[SolanaTokenAccount_TimestampSelector.TokenAccountSlotSource]: async ({ $tokenAccount, slot, source }) => {
					if (source !== Source.Solana_JsonRpc) throw new Error(`Solana_JsonRpc: unsupported source ${source}`)
					assertSolanaMainnet($tokenAccount.$network)
					const { getParsedTokenAccountInfo } = await import('$/sources/Solana/JsonRpc/queries.ts')
					const accountInfo = await getParsedTokenAccountInfo({
						rpcUrl: await solanaMainnetRpcUrl(),
						pubkey: $tokenAccount.tokenAccountPubkey,
					})
					if (accountInfo.value == null) throw new Error(`Solana_JsonRpc: token account not found for address ${$tokenAccount.tokenAccountPubkey}`)
					return solanaTokenAccountTimestampFields(
						$tokenAccount,
						accountInfo.value.data.parsed.info,
						slot
					)
				},
			},
		})({
				$tokenAccount: (timestamp) => timestamp.$tokenAccount,
				slot: (timestamp) => timestamp.slot,
				source: (timestamp) => timestamp.source,
				amount: (timestamp) => timestamp.amount,
				decimals: (timestamp) => timestamp.decimals,
				uiAmountString: (timestamp) => timestamp.uiAmountString,
				state: (timestamp) => timestamp.state,
				isNative: (timestamp) => timestamp.isNative,
				delegatedAmount: (timestamp) => timestamp.delegatedAmount,
				rentExemptReserveLamports: (timestamp) => timestamp.rentExemptReserveLamports,
				ownerPubkey: (timestamp) => timestamp.ownerPubkey,
				mintAddress: (timestamp) => timestamp.mintAddress,
				delegatePubkey: (timestamp) => timestamp.delegatePubkey,
				closeAuthorityPubkey: (timestamp) => timestamp.closeAuthorityPubkey,
			}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaValidator,
			resolve: {
				[SolanaValidatorSelector.NetworkVotePubkey]: async ({ $network, votePubkey }) => {
					assertSolanaMainnet($network)
					const { getSlot, getVoteAccounts } = await import('$/sources/Solana/JsonRpc/queries.ts')
					const voteAccounts = await getVoteAccounts({
						rpcUrl: await solanaMainnetRpcUrl(),
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
						$$timestamps: [
							{
								[EntityMetaKey.Selector]: {
									$validator: {
										$network,
										votePubkey,
									},
									slot: BigInt(await getSlot({
										rpcUrl: await solanaMainnetRpcUrl(),
									})),
									source: Source.Solana_JsonRpc,
								},
							},
						],
					}
				}
			},
		})({
				nodePubkey: (validator) => validator.nodePubkey,
				$$timestamps: (validator) => validator.$$timestamps,
			}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.SolanaValidator_Timestamp,
			resolve: {
				[SolanaValidator_TimestampSelector.ValidatorSlotSource]: async ({ $validator, slot, source }) => {
					if (source !== Source.Solana_JsonRpc) throw new Error(`Solana_JsonRpc: unsupported source ${source}`)
					assertSolanaMainnet($validator.$network)
					const { getVoteAccounts } = await import('$/sources/Solana/JsonRpc/queries.ts')
					const voteAccounts = await getVoteAccounts({
						rpcUrl: await solanaMainnetRpcUrl(),
						votePubkey: $validator.votePubkey,
					})
					const currentVoteAccount = voteAccounts.current.find((voteAccount) => (
						voteAccount.votePubkey === $validator.votePubkey
					))
					const delinquentVoteAccount = voteAccounts.delinquent.find((voteAccount) => (
						voteAccount.votePubkey === $validator.votePubkey
					))
					const voteAccount = currentVoteAccount ?? delinquentVoteAccount
					if (voteAccount == null) throw new Error(`Solana_JsonRpc: validator vote account not found for ${$validator.votePubkey}`)
					return {
						$validator: {
							[EntityMetaKey.Selector]: $validator,
						},
						slot,
						source,
						activatedStakeLamports: BigInt(voteAccount.activatedStake),
						commission: voteAccount.commission,
						delinquent: delinquentVoteAccount != null,
						lastVoteSlot: BigInt(voteAccount.lastVote),
						rootSlot: BigInt(voteAccount.rootSlot),
					}
				}
			},
		})({
				$validator: (timestamp) => timestamp.$validator,
				slot: (timestamp) => timestamp.slot,
				source: (timestamp) => timestamp.source,
				activatedStakeLamports: (timestamp) => timestamp.activatedStakeLamports,
				commission: (timestamp) => timestamp.commission,
				delinquent: (timestamp) => timestamp.delinquent,
				lastVoteSlot: (timestamp) => timestamp.lastVoteSlot,
				rootSlot: (timestamp) => timestamp.rootSlot,
				epochCredits: (timestamp) => timestamp.epochCredits,
			}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async ({ caip2 }) => {
					assertSolanaMainnet({ caip2 })
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: { caip2 },
								timestampMs: Date.now(),
								source: Source.Solana_JsonRpc,
							},
						},
					]
				}
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async ({ caip2 }, context) => {
					assertSolanaMainnet({ caip2 })
					const {
						getBlocks,
						getSlot,
					} = await import('$/sources/Solana/JsonRpc/queries.ts')
					const limit = resolverContextRowLimit(context)
					const endSlot = BigInt(await getSlot({
						rpcUrl: await solanaMainnetRpcUrl(),
					}))
					return (await getBlocks({
						rpcUrl: await solanaMainnetRpcUrl(),
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
				Solana: {
					$$blocks: (blocks) => blocks,
				},
			}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async ({ caip2 }) => {
					assertSolanaMainnet({ caip2 })
					const { getSlot, getVoteAccounts } = await import('$/sources/Solana/JsonRpc/queries.ts')
					return solanaValidatorRows(
						{ caip2 },
						await getVoteAccounts({
							rpcUrl: await solanaMainnetRpcUrl(),
						}),
						BigInt(await getSlot({
							rpcUrl: await solanaMainnetRpcUrl(),
						}))
					)
				}
			},
		})({
				Solana: {
					$$validators: (validators) => validators,
				},
			}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async ({ caip2 }, context) => {
					assertSolanaMainnet({ caip2 })
					const {
						getBlock,
						getBlocks,
						getSlot,
					} = await import('$/sources/Solana/JsonRpc/queries.ts')
					const limit = resolverContextRowLimit(context)
					const endSlot = BigInt(await getSlot({
						rpcUrl: await solanaMainnetRpcUrl(),
					}))
					return (
						await Promise.all(
							(await getBlocks({
								rpcUrl: await solanaMainnetRpcUrl(),
								startSlot: endSlot > 31n ? endSlot - 31n : 0n,
								endSlot,
							}))
								.toReversed()
								.map(async (slot) => ({
									slot: BigInt(slot),
									block: await getBlock({
										rpcUrl: await solanaMainnetRpcUrl(),
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
											$$timestamps: [
												solanaTransactionTimestampFields(
													{
														$network: { caip2 },
														signature,
													},
													transaction,
													slot
												),
											],
										},
									]
						}) ?? []
						))
						.slice(0, limit)
				}
			},
		})({
				Solana: {
					$$transactions: (transactions) => transactions,
				},
			}),

		defineResolver(Source.Solana_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async ({ caip2 }, context) => {
					assertSolanaMainnet({ caip2 })
					const {
						getBlock,
						getBlocks,
						getSlot,
					} = await import('$/sources/Solana/JsonRpc/queries.ts')
					const limit = resolverContextRowLimit(context)
					const endSlot = BigInt(await getSlot({
						rpcUrl: await solanaMainnetRpcUrl(),
					}))
					return [
						...new Set(
							(
							await Promise.all(
								(await getBlocks({
									rpcUrl: await solanaMainnetRpcUrl(),
									startSlot: endSlot > 31n ? endSlot - 31n : 0n,
									endSlot,
								}))
									.toReversed()
									.map(async (slot) => (
										(await getBlock({
											rpcUrl: await solanaMainnetRpcUrl(),
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
				Solana: {
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
							rpcUrl: await solanaMainnetRpcUrl(),
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
										$$timestamps: [
											solanaTransactionTimestampFields(
												{
													$network,
													signature,
												},
												transaction,
												slot
											),
										],
									},
								]
						})
				},
			},
		})({
				$$transactions: (transactions) => transactions,
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
				$$instructions: (instructions) => instructions.map((instruction) => ({
					[EntityMetaKey.Selector]: instruction[EntityMetaKey.Selector],
				})),
			}),
	],
}
