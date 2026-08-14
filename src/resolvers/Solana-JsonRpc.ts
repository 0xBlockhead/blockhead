import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	networkBySlug,
	NetworkExecutionModel,
	NetworkLedgerModel,
} from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	SolanaRpcAccountInfo,
	SolanaRpcInstruction,
	SolanaRpcParsedTokenAccountInfo,
	SolanaRpcTransactionWithMeta,
	SolanaRpcVoteAccount,
	SolanaRpcVoteAccounts,
} from '$/sources/Solana/JsonRpc/types.ts'
import { SolanaInstructionKind } from '$/schema/SolanaInstructionKind.ts'
import { schema } from '$/schema/index.ts'

type SolanaNetworkSelector = EntitySelector<typeof schema, EntityType.Network>
type SolanaTransactionSelector = EntitySelector<typeof schema, EntityType.SolanaTransaction>
type SolanaInstructionSelector = EntitySelector<typeof schema, EntityType.SolanaInstruction>
type SolanaAccountSelector = EntitySelector<typeof schema, EntityType.SolanaAccount>
type SolanaTokenAccountSelector = EntitySelector<typeof schema, EntityType.SolanaTokenAccount>
type SolanaValidatorSelector = EntitySelector<typeof schema, EntityType.SolanaValidator>

const solanaMainnetCaip2 = networkBySlug.solana.caip2

const assertSolanaMainnet = (network: SolanaNetworkSelector) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== solanaMainnetCaip2.namespace
		|| network.caip2.reference !== solanaMainnetCaip2.reference
	) {
		throw new Error('Solana_JsonRpc: unsupported network')
	}
}

const getSolanaNetworkHead = async () => {
	const {
		getBlockHeight,
		getBlockTime,
		getSlot,
	} = await import('$/sources/Solana/JsonRpc/queries.ts')
	const slot = await getSlot()
	const [
		blockHeight,
		blockTime,
	] = await Promise.all([
		getBlockHeight(),
		getBlockTime({
			slot: BigInt(slot),
		}),
	])
	if (blockTime == null)
		throw new Error('Solana_JsonRpc: finalized head block has no blockTime')

	return {
		absoluteSlot: BigInt(slot),
		blockHeight: BigInt(blockHeight),
		timestampMs: blockTime * 1000,
	}
}

const solanaNetworkHeadTimestampReference = (
	network: SolanaNetworkSelector,
	head: Awaited<ReturnType<typeof getSolanaNetworkHead>>
) => ({
	[EntityMetaKey.Selector]: {
		$network: network,
		timestampMs: head.timestampMs,
		source: Source.Solana_JsonRpc,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.Network_Timestamp, ['Solana'], 'absoluteSlot')]: head.absoluteSlot,
		[entityFieldAddressKey(EntityType.Network_Timestamp, ['Solana'], 'blockHeight')]: head.blockHeight,
	},
})

const solanaTransactionSnapshot = (
	network: SolanaNetworkSelector,
	transaction: SolanaRpcTransactionWithMeta,
	slot?: bigint
) => ({
	...(slot != null && {
		slot,
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

const solanaTransactionTimestampSnapshot = (
	transactionId: SolanaTransactionSelector,
	transaction: SolanaRpcTransactionWithMeta & {
		blockTime?: number
	},
	slot: bigint
) => ({
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

const solanaTransactionRow = (
	network: SolanaNetworkSelector,
	signature: string,
	transaction: SolanaRpcTransactionWithMeta,
	slot: bigint
) => {
	const transactionSnapshot = solanaTransactionSnapshot(
		network,
		transaction,
		slot
	)
	const timestamp = solanaTransactionTimestampSnapshot(
		{
			$network: network,
			signature,
		},
		transaction,
		slot
	)
	return {
		[EntityMetaKey.Selector]: {
			$network: network,
			signature,
		},
		[EntityMetaKey.Fields]: {
			...(transactionSnapshot.$block != null && {
				[entityFieldAddressKey(EntityType.SolanaTransaction, [], '$block')]: transactionSnapshot.$block,
			}),
			...(transactionSnapshot.$feePayer != null && {
				[entityFieldAddressKey(EntityType.SolanaTransaction, [], '$feePayer')]: transactionSnapshot.$feePayer,
			}),
			[entityFieldAddressKey(EntityType.SolanaTransaction, [], 'slot')]: slot,
			[entityFieldAddressKey(EntityType.SolanaTransaction, [], '$$timestamps')]: [
				{
					[EntityMetaKey.Selector]: {
						$transaction: {
							$network: network,
							signature,
						},
						slot,
						source: Source.Solana_JsonRpc,
					},
					[EntityMetaKey.Fields]: {
						...(timestamp.timestampMs != null && {
							[entityFieldAddressKey(EntityType.SolanaTransaction_Timestamp, [], 'timestampMs')]: timestamp.timestampMs,
						}),
						...(timestamp.feeLamports != null && {
							[entityFieldAddressKey(EntityType.SolanaTransaction_Timestamp, [], 'feeLamports')]: timestamp.feeLamports,
						}),
						...(timestamp.computeUnitsConsumed != null && {
							[entityFieldAddressKey(EntityType.SolanaTransaction_Timestamp, [], 'computeUnitsConsumed')]: timestamp.computeUnitsConsumed,
						}),
						...(timestamp.status != null && {
							[entityFieldAddressKey(EntityType.SolanaTransaction_Timestamp, [], 'status')]: timestamp.status,
						}),
						...(timestamp.err != null && {
							[entityFieldAddressKey(EntityType.SolanaTransaction_Timestamp, [], 'err')]: timestamp.err,
						}),
					},
				},
			],
		},
	}
}

const solanaInstructionSnapshot = (
	network: SolanaNetworkSelector,
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
	$$accounts: instruction.accounts?.map((pubkey) => ({
		[EntityMetaKey.Selector]: {
			$network: network,
			pubkey,
		},
	})) ?? [],
})

const solanaInstructionRow = (
	network: SolanaNetworkSelector,
	selector: SolanaInstructionSelector,
	instruction: SolanaRpcInstruction
) => {
	const snapshot = solanaInstructionSnapshot(network, instruction)
	return {
		[EntityMetaKey.Selector]: selector,
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.SolanaInstruction, [], '$program')]: snapshot.$program,
			...(snapshot.parsedType != null && {
				[entityFieldAddressKey(EntityType.SolanaInstruction, [], 'parsedType')]: snapshot.parsedType,
			}),
			...(snapshot.data != null && {
				[entityFieldAddressKey(EntityType.SolanaInstruction, [], 'data')]: snapshot.data,
			}),
			...(snapshot.stackHeight != null && {
				[entityFieldAddressKey(EntityType.SolanaInstruction, [], 'stackHeight')]: snapshot.stackHeight,
			}),
			[entityFieldAddressKey(EntityType.SolanaInstruction, [], '$$accounts')]: snapshot.$$accounts,
		},
	}
}

const solanaInstructionReferences = (
	transactionId: SolanaTransactionSelector,
	transaction: SolanaRpcTransactionWithMeta
) => [
	...transaction.transaction.message.instructions.map((_instruction, indexInTransaction) => ({
		[EntityMetaKey.Selector]: {
			$transaction: transactionId,
			instructionKind: SolanaInstructionKind.Instruction,
			indexInTransaction,
		},
	})),
	...(transaction.meta?.innerInstructions ?? []).flatMap((innerInstructionGroup) => (
		innerInstructionGroup.instructions.map((_instruction, indexInInstruction) => ({
			[EntityMetaKey.Selector]: {
				$transaction: transactionId,
				instructionKind: SolanaInstructionKind.InnerInstruction,
				indexInTransaction: innerInstructionGroup.index,
				indexInInstruction,
			},
		}))
	)),
]

const solanaInstructionRows = (
	network: SolanaNetworkSelector,
	transactionId: SolanaTransactionSelector,
	transaction: SolanaRpcTransactionWithMeta
) => {
	const references = solanaInstructionReferences(transactionId, transaction)
	return [
		...transaction.transaction.message.instructions,
		...(transaction.meta?.innerInstructions ?? [])
			.flatMap((innerInstructionGroup) => innerInstructionGroup.instructions),
	].map((instruction, index) => (
		solanaInstructionRow(
			network,
			references[index][EntityMetaKey.Selector],
			instruction
		)
	))
}

const solanaAccountTimestampSnapshot = (
	accountId: SolanaAccountSelector,
	accountInfo: NonNullable<SolanaRpcAccountInfo['value']>,
	slot: bigint
) => ({
	$account: {
		[EntityMetaKey.Selector]: accountId,
	},
	$ownerProgram: {
		[EntityMetaKey.Selector]: {
			$network: accountId.$network,
			programId: accountInfo.owner,
		},
	},
	slot,
	source: Source.Solana_JsonRpc,
	lamports: BigInt(accountInfo.lamports),
	rentEpoch: BigInt(accountInfo.rentEpoch),
	executable: accountInfo.executable,
	dataEncoding: accountInfo.data[1],
})

const solanaValidatorTimestampSnapshot = (
	validatorId: SolanaValidatorSelector,
	voteAccount: SolanaRpcVoteAccount,
	timestampMs: number,
	delinquent: boolean
) => ({
	$validator: {
		[EntityMetaKey.Selector]: validatorId,
	},
	timestampMs,
	source: Source.Solana_JsonRpc,
	nodePubkey: voteAccount.nodePubkey,
	activatedStakeLamports: BigInt(voteAccount.activatedStake),
	commission: voteAccount.commission,
	delinquent,
	lastVoteSlot: BigInt(voteAccount.lastVote),
	rootSlot: BigInt(voteAccount.rootSlot),
	epochCredits: voteAccount.epochCredits,
})

const getSolanaTransaction = async ({ $network, signature }: SolanaTransactionSelector) => {
	assertSolanaMainnet($network)
	const { getTransaction } = await import('$/sources/Solana/JsonRpc/queries.ts')
	const transaction = await getTransaction({
		signature: signature,
	})
	if (transaction == null) throw new Error(`Solana_JsonRpc: transaction not found for signature ${signature}`)
	return transaction
}

const getSolanaVoteAccount = async (votePubkey: string) => {
	const { getVoteAccounts } = await import('$/sources/Solana/JsonRpc/queries.ts')
	const voteAccounts = await getVoteAccounts({
		votePubkey,
	})
	const current = voteAccounts.current.find((voteAccount) => voteAccount.votePubkey === votePubkey)
	const delinquent = voteAccounts.delinquent.find((voteAccount) => voteAccount.votePubkey === votePubkey)
	const voteAccount = current ?? delinquent
	if (voteAccount == null) throw new Error(`Solana_JsonRpc: validator vote account not found for ${votePubkey}`)
	return {
		voteAccount,
		delinquent: delinquent != null,
		observedAtMs: voteAccounts.observedAtMs,
	}
}

const solanaValidatorRows = (
	network: SolanaNetworkSelector,
	voteAccounts: SolanaRpcVoteAccounts,
	observedAtMs: number
) => (
	[
		...voteAccounts.current.map((voteAccount) => ({
			voteAccount,
			delinquent: false,
		})),
		...voteAccounts.delinquent.map((voteAccount) => ({
			voteAccount,
			delinquent: true,
		})),
	]
		.map(({ voteAccount, delinquent }) => {
			const validator = {
				$network: network,
				votePubkey: voteAccount.votePubkey,
			}
			const timestamp = solanaValidatorTimestampSnapshot(
				validator,
				voteAccount,
				observedAtMs,
				delinquent
			)
			return {
				[EntityMetaKey.Selector]: validator,
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SolanaValidator, [], '$$timestamps')]: [
						{
							[EntityMetaKey.Selector]: {
								$validator: validator,
								timestampMs: observedAtMs,
								source: Source.Solana_JsonRpc,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'nodePubkey')]: timestamp.nodePubkey,
								[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'activatedStakeLamports')]: timestamp.activatedStakeLamports,
								[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'commission')]: timestamp.commission,
								[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'delinquent')]: timestamp.delinquent,
								[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'lastVoteSlot')]: timestamp.lastVoteSlot,
								[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'rootSlot')]: timestamp.rootSlot,
								...(timestamp.epochCredits != null && {
									[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'epochCredits')]: timestamp.epochCredits,
								}),
							},
						},
					],
				},
			}
		})
)

const solanaTokenAccountTimestampSnapshot = (
	tokenAccount: SolanaTokenAccountSelector,
	info: NonNullable<SolanaRpcParsedTokenAccountInfo['value']>['data']['parsed']['info'],
	slot: bigint
) => ({
	$tokenAccount: {
		[EntityMetaKey.Selector]: tokenAccount,
	},
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
		defineResolver({
			entityType: EntityType.SolanaBlock,
			resolve: {
				Slot: {
					resolve: async ({ $network, slot }) => {
						assertSolanaMainnet($network)

						const { getBlock } = await import('$/sources/Solana/JsonRpc/queries.ts')
						const block = await getBlock({
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
										solanaTransactionRow(
											$network,
											signature,
											transaction,
											slot
										),
									]
							}),
						}
					},
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

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						assertSolanaMainnet({ caip2 })
						const { solanaRpcEndpoints } = await import('$/sources/Solana/JsonRpc/queries.ts')
						return solanaRpcEndpoints
					},
				}
			},
		})({
				Solana: {
					rpcEndpoints: (rpcEndpoints) => rpcEndpoints,
				},
			}),

		defineResolver({
			entityType: EntityType.Network_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({ $network, timestampMs, source }) => {
						if (source !== Source.Solana_JsonRpc) throw new Error(`Solana_JsonRpc: unsupported source ${source}`)
						assertSolanaMainnet($network)
						const {
							getBlockHeight,
							getEpochInfo,
							getHealth,
							getSlot,
							getVersion,
							getVoteAccounts,
						} = await import('$/sources/Solana/JsonRpc/queries.ts')
						const [
							slot,
							blockHeight,
							epochInfo,
							health,
							version,
							voteAccounts,
						] = await Promise.all([
							getSlot(),
							getBlockHeight(),
							getEpochInfo(),
							getHealth(),
							getVersion(),
							getVoteAccounts({}),
						])
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source: Source.Solana_JsonRpc,
							ledgerModels: [NetworkLedgerModel.Account],
							executionModels: [NetworkExecutionModel.SolanaRuntime],
							absoluteSlot: BigInt(slot),
							blockHeight: BigInt(blockHeight),
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
					},
				}
			},
		})({
				$network: (timestamp) => timestamp.$network,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				ledgerModels: (timestamp) => timestamp.ledgerModels,
				executionModels: (timestamp) => timestamp.executionModels,
				Solana: {
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

		defineResolver({
			entityType: EntityType.SolanaTransaction,
			resolve: {
				NetworkSignature: {
					resolve: async ({ $network, signature }) => {
						const transaction = await getSolanaTransaction({
							$network,
							signature,
						})
						return {
							...solanaTransactionSnapshot(
								$network,
								transaction,
								BigInt(transaction.slot)
							),
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$transaction: {
											$network,
											signature,
										},
										slot: BigInt(transaction.slot),
										source: Source.Solana_JsonRpc,
									},
								},
							],
							$$instructions: solanaInstructionReferences(
								{
									$network,
									signature,
								},
								transaction
							),
						}
					},
				},
			},
		})({
				$block: (transaction) => transaction.$block,
				$feePayer: (transaction) => transaction.$feePayer,
				slot: (transaction) => transaction.slot,
				$$timestamps: (transaction) => transaction.$$timestamps,
				$$instructions: (transaction) => transaction.$$instructions,
			}),

		defineResolver({
			entityType: EntityType.SolanaTransaction_Timestamp,
			resolve: {
				TransactionSlotSource: {
					resolve: async ({ $transaction, slot, source }) => {
						if (source !== Source.Solana_JsonRpc) throw new Error(`Solana_JsonRpc: unsupported source ${source}`)
						const transaction = await getSolanaTransaction($transaction)
						if (BigInt(transaction.slot) !== slot) throw new Error('Solana_JsonRpc: SolanaTransaction_Timestamp id does not match transaction slot')
						const { getSignatureStatuses } = await import('$/sources/Solana/JsonRpc/queries.ts')
						return {
							...solanaTransactionTimestampSnapshot(
								$transaction,
								transaction,
								slot
							),
							confirmationStatus: (await getSignatureStatuses({
								signatures: [$transaction.signature],
							})).value[0]?.confirmationStatus,
						}
					},
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

		defineResolver({
			entityType: EntityType.SolanaInstruction,
			resolve: {
				SolanaTransactionIndexInTransaction: {
					resolve: async ({ $transaction, indexInTransaction }) => {
						const transaction = await getSolanaTransaction($transaction)
						return {
							instructionKind: SolanaInstructionKind.Instruction,
							indexInTransaction,
							...solanaInstructionSnapshot(
								$transaction.$network,
								transaction.transaction.message.instructions[indexInTransaction]
							),
						}
					},
				},
				SolanaTransactionIndexInInstruction: {
					resolve: async ({ $transaction, indexInTransaction, indexInInstruction }) => {
						const transaction = await getSolanaTransaction($transaction)
						const instruction = transaction.meta?.innerInstructions
							?.find((innerInstructionGroup) => innerInstructionGroup.index === indexInTransaction)
							?.instructions[indexInInstruction]
						if (instruction == null) throw new Error(`Solana_JsonRpc: instruction not found for ${$transaction.signature}`)
						return {
							instructionKind: SolanaInstructionKind.InnerInstruction,
							indexInTransaction,
							indexInInstruction,
							...solanaInstructionSnapshot(
								$transaction.$network,
								instruction
							),
						}
					},
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

		defineResolver({
			entityType: EntityType.SolanaAccount,
			resolve: {
				NetworkPubkey: {
					resolve: async ({ $network, pubkey }) => {
						assertSolanaMainnet($network)
						const { getAccountInfo } = await import('$/sources/Solana/JsonRpc/queries.ts')
						const accountInfo = await getAccountInfo({
							pubkey: pubkey,
						})
						if (accountInfo.value == null) throw new Error(`Solana_JsonRpc: account not found for pubkey ${pubkey}`)
						return {
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$account: {
											$network,
											pubkey,
										},
										slot: BigInt(accountInfo.context.slot),
										source: Source.Solana_JsonRpc,
									},
								},
							],
						}
					},
				}
			},
		})({
				$$timestamps: (account) => account.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.SolanaAccount,
			resolve: {
				NetworkPubkey: {
					resolve: async ({ $network, pubkey }, context) => {
						assertSolanaMainnet($network)
						const { getTokenAccountsByOwner } = await import('$/sources/Solana/JsonRpc/queries.ts')
						const page = await getTokenAccountsByOwner({
							owner: pubkey,
							limit: resolverContextRowLimit(context),
						})
						return {
							$$tokenAccounts: page.value.map((tokenAccount) => {
								const info = tokenAccount.account.data.parsed.info
								return {
									[EntityMetaKey.Selector]: {
										$network,
										tokenAccountPubkey: tokenAccount.pubkey,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.SolanaTokenAccount, [], '$account')]: {
											[EntityMetaKey.Selector]: {
												$network,
												pubkey: tokenAccount.pubkey,
											},
										},
										[entityFieldAddressKey(EntityType.SolanaTokenAccount, [], '$mint')]: {
											[EntityMetaKey.Selector]: {
												$network,
												mintAddress: info.mint,
											},
										},
										[entityFieldAddressKey(EntityType.SolanaTokenAccount, [], '$owner')]: {
											[EntityMetaKey.Selector]: {
												$network,
												pubkey: info.owner,
											},
										},
										...(info.delegate != null && {
											[entityFieldAddressKey(EntityType.SolanaTokenAccount, [], '$delegate')]: {
												[EntityMetaKey.Selector]: {
													$network,
													pubkey: info.delegate,
												},
											},
										}),
										...(info.closeAuthority != null && {
											[entityFieldAddressKey(EntityType.SolanaTokenAccount, [], '$closeAuthority')]: {
												[EntityMetaKey.Selector]: {
													$network,
													pubkey: info.closeAuthority,
												},
											},
										}),
										[entityFieldAddressKey(EntityType.SolanaTokenAccount, [], '$$timestamps')]: [
											{
												[EntityMetaKey.Selector]: {
													$tokenAccount: {
														$network,
														tokenAccountPubkey: tokenAccount.pubkey,
													},
													slot: BigInt(page.context.slot),
													source: Source.Solana_JsonRpc,
												},
											},
										],
									},
								}
							}),
						}
					},
				},
			},
		})({
			$$tokenAccounts: (account) => account.$$tokenAccounts,
		}),

		defineResolver({
			entityType: EntityType.SolanaAccount_Timestamp,
			resolve: {
				AccountSlotSource: {
					resolve: async ({ $account, slot, source }) => {
						if (source !== Source.Solana_JsonRpc) throw new Error(`Solana_JsonRpc: unsupported source ${source}`)
						assertSolanaMainnet($account.$network)
						const { getAccountInfo } = await import('$/sources/Solana/JsonRpc/queries.ts')
						const accountInfo = await getAccountInfo({
							pubkey: $account.pubkey,
						})
						if (accountInfo.value == null) throw new Error(`Solana_JsonRpc: account not found for pubkey ${$account.pubkey}`)
						return solanaAccountTimestampSnapshot(
							$account,
							accountInfo.value,
							slot
						)
					},
				},
			},
		})({
				$account: (timestamp) => timestamp.$account,
				slot: (timestamp) => timestamp.slot,
				source: (timestamp) => timestamp.source,
				lamports: (timestamp) => timestamp.lamports,
				$ownerProgram: (timestamp) => timestamp.$ownerProgram,
				rentEpoch: (timestamp) => timestamp.rentEpoch,
				executable: (timestamp) => timestamp.executable,
				dataEncoding: (timestamp) => timestamp.dataEncoding,
			}),

		defineResolver({
			entityType: EntityType.SolanaProgram,
			resolve: {
				NetworkProgramId: {
					resolve: async ({ $network, programId }) => {
						assertSolanaMainnet($network)
						const { getProgramInfo } = await import('$/sources/Solana/JsonRpc/queries.ts')
						const program = await getProgramInfo({
							programId,
						})
						return {
							$programAccount: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									pubkey: programId,
								},
							},
							...(program.upgradeAuthorityAddress != null && {
								$upgradeAuthority: {
									[EntityMetaKey.Selector]: {
										$network,
										pubkey: program.upgradeAuthorityAddress,
									},
								},
							}),
						}
					},
				}
			},
		})({
				$programAccount: (program) => program.$programAccount,
				$upgradeAuthority: (program) => program.$upgradeAuthority,
			}),

		defineResolver({
			entityType: EntityType.SolanaTokenMint,
			resolve: {
				NetworkMintAddress: {
					resolve: async ({ $network, mintAddress }) => {
						assertSolanaMainnet($network)
						const { getParsedTokenMintAccountInfo } = await import('$/sources/Solana/JsonRpc/queries.ts')
						const accountInfo = await getParsedTokenMintAccountInfo({
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
										slot: BigInt(accountInfo.context.slot),
										source: Source.Solana_JsonRpc,
									},
								},
							],
						}
					},
				}
			},
		})({
				$$timestamps: (mint) => mint.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.SolanaTokenMint_Timestamp,
			resolve: {
				MintSlotSource: {
					resolve: async ({ $mint, slot, source }) => {
						if (source !== Source.Solana_JsonRpc) throw new Error(`Solana_JsonRpc: unsupported source ${source}`)
						assertSolanaMainnet($mint.$network)
						const { getParsedTokenMintAccountInfo } = await import('$/sources/Solana/JsonRpc/queries.ts')
						const accountInfo = await getParsedTokenMintAccountInfo({
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
					},
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

		defineResolver({
			entityType: EntityType.SolanaTokenAccount,
			resolve: {
				NetworkTokenAccountPubkey: {
					resolve: async ({ $network, tokenAccountPubkey }) => {
						assertSolanaMainnet($network)
						const { getParsedTokenAccountInfo } = await import('$/sources/Solana/JsonRpc/queries.ts')
						const accountInfo = await getParsedTokenAccountInfo({
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
										slot: BigInt(accountInfo.context.slot),
										source: Source.Solana_JsonRpc,
									},
								},
							],
						}
					},
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

		defineResolver({
			entityType: EntityType.SolanaTokenAccount_Timestamp,
			resolve: {
				TokenAccountSlotSource: {
					resolve: async ({ $tokenAccount, slot, source }) => {
						if (source !== Source.Solana_JsonRpc) throw new Error(`Solana_JsonRpc: unsupported source ${source}`)
						assertSolanaMainnet($tokenAccount.$network)
						const { getParsedTokenAccountInfo } = await import('$/sources/Solana/JsonRpc/queries.ts')
						const accountInfo = await getParsedTokenAccountInfo({
							pubkey: $tokenAccount.tokenAccountPubkey,
						})
						if (accountInfo.value == null) throw new Error(`Solana_JsonRpc: token account not found for address ${$tokenAccount.tokenAccountPubkey}`)
						return solanaTokenAccountTimestampSnapshot(
							$tokenAccount,
							accountInfo.value.data.parsed.info,
							slot
						)
					},
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

		defineResolver({
			entityType: EntityType.SolanaValidator,
			resolve: {
				NetworkVotePubkey: {
					resolve: async ({ $network, votePubkey }) => {
						assertSolanaMainnet($network)
						const {
							voteAccount,
							delinquent,
							observedAtMs,
						} = await getSolanaVoteAccount(votePubkey)
						return {
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$validator: {
											$network,
											votePubkey,
										},
										timestampMs: observedAtMs,
										source: Source.Solana_JsonRpc,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'nodePubkey')]: voteAccount.nodePubkey,
										[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'activatedStakeLamports')]: BigInt(voteAccount.activatedStake),
										[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'commission')]: voteAccount.commission,
										[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'delinquent')]: delinquent,
										[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'lastVoteSlot')]: BigInt(voteAccount.lastVote),
										[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'rootSlot')]: BigInt(voteAccount.rootSlot),
										...(voteAccount.epochCredits != null && {
											[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'epochCredits')]: voteAccount.epochCredits,
										}),
									},
								},
							],
						}
					},
				}
			},
		})({
				$$timestamps: (validator) => validator.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						assertSolanaMainnet({ caip2 })
						const head = await getSolanaNetworkHead()
						return [
							solanaNetworkHeadTimestampReference({ caip2 }, head),
						]
					},
				}
			},
			// slotSubscribe — https://solana.com/docs/rpc/websocket/slotsubscribe
			resolveLive: {
				slotStream: {
					facetPath: [],
					publishes: {
						'$$timestamps': true,
					},
					start: async ({
						fields,
						parentEntitySelector,
						signal,
						trigger,
					}) => {
						assertSolanaMainnet(parentEntitySelector)
						const {
							getBlockTime,
							subscribeSlot,
						} = await import('$/sources/Solana/JsonRpc/queries.ts')
						for await (const notification of subscribeSlot(trigger.sourceBinding, signal)) {
							if (signal.aborted)
								return

							const blockTime = await getBlockTime({
								slot: BigInt(notification.slot),
							})
							if (blockTime == null)
								continue

							fields.$$timestamps.replaceRows([{
								source: Source.Solana_JsonRpc,
								value: [{
									[EntityMetaKey.Selector]: {
										$network: parentEntitySelector,
										timestampMs: blockTime * 1000,
										source: Source.Solana_JsonRpc,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.Network_Timestamp, ['Solana'], 'absoluteSlot')]: BigInt(notification.slot),
									},
								}],
							}])
						}
					},
				},
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						assertSolanaMainnet({ caip2 })
						const {
							getBlocks,
							getSlot,
						} = await import('$/sources/Solana/JsonRpc/queries.ts')
						const limit = resolverContextRowLimit(context)
						const endSlot = BigInt(await getSlot())
						return (await getBlocks({
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
					},
				}
			},
		})({
				Solana: {
					$$blocks: (blocks) => blocks,
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						assertSolanaMainnet({ caip2 })
						const { getVoteAccounts } = await import('$/sources/Solana/JsonRpc/queries.ts')
						const voteAccounts = await getVoteAccounts({})
						return solanaValidatorRows(
							{ caip2 },
							voteAccounts,
							voteAccounts.observedAtMs
						)
					},
				}
			},
		})({
				Solana: {
					$$validators: (validators) => validators,
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						assertSolanaMainnet({ caip2 })
						const { getVoteAccounts } = await import('$/sources/Solana/JsonRpc/queries.ts')
						const voteAccounts = await getVoteAccounts({})
						return voteAccounts.current.length + voteAccounts.delinquent.length
					},
				}
			},
		})({
				Solana: {
					$$validators: {
						resolveCount: (count) => count,
					},
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						assertSolanaMainnet({ caip2 })
						const {
							getBlock,
							getBlocks,
							getSlot,
						} = await import('$/sources/Solana/JsonRpc/queries.ts')
						const limit = resolverContextRowLimit(context)
						const endSlot = BigInt(await getSlot())
						const blocks = (
							await Promise.all(
								(await getBlocks({
									startSlot: endSlot > 31n ? endSlot - 31n : 0n,
									endSlot,
								}))
									.toReversed()
									.map(async (slot) => ({
										slot: BigInt(slot),
										block: await getBlock({
											slot: BigInt(slot),
										}),
									}))
							)
						)
						const transactions = blocks.flatMap(({ block }) => block?.transactions ?? [])
						const instructions = transactions.flatMap((transaction) => [
							...transaction.transaction.message.instructions,
							...(transaction.meta?.innerInstructions?.flatMap((innerInstructions) => innerInstructions.instructions) ?? []),
						])
						const tokenInstructions = instructions.filter((instruction) => (
							instruction.program === 'spl-token'
							|| instruction.program === 'spl-token-2022'
							|| instruction.program === 'spl-associated-token-account'
						))
						return {
							transactions: blocks
								.flatMap(({ block, slot }) => (
									block?.transactions.flatMap((transaction) => {
										const signature = transaction.transaction.signatures.at(0)
										return signature == null ?
											[]
										:
											[
												solanaTransactionRow(
													{ caip2 },
													signature,
													transaction,
													slot
												),
											]
									}) ?? []
								))
								.slice(0, limit),
							accounts: [...new Set(
								transactions.flatMap((transaction) => (
									transaction.transaction.message.accountKeys.map((accountKey) => accountKey.pubkey)
								))
							)]
								.slice(0, limit)
								.map((pubkey) => ({
									[EntityMetaKey.Selector]: {
										$network: { caip2 },
										pubkey,
									},
								})),
							programs: [...new Set(
								instructions.map((instruction) => instruction.programId)
							)]
								.slice(0, limit)
								.map((programId) => ({
									[EntityMetaKey.Selector]: {
										$network: { caip2 },
										programId,
									},
								})),
							tokenAccounts: [...new Set(
								tokenInstructions.flatMap((instruction) => [
									instruction.parsed?.info?.account,
									instruction.parsed?.info?.destination,
									instruction.parsed?.info?.newAccount,
									instruction.parsed?.info?.source,
								].filter((pubkey) => pubkey != null))
							)]
								.slice(0, limit)
								.map((tokenAccountPubkey) => ({
									[EntityMetaKey.Selector]: {
										$network: { caip2 },
										tokenAccountPubkey,
									},
								})),
							tokenMints: [...new Set(
								tokenInstructions.flatMap((instruction) => (
									instruction.parsed?.info?.mint == null ?
										[]
									:
										[instruction.parsed.info.mint]
								))
							)]
								.slice(0, limit)
								.map((mintAddress) => ({
									[EntityMetaKey.Selector]: {
										$network: { caip2 },
										mintAddress,
									},
								})),
						}
					},
				}
			},
		})({
				Solana: {
					$$transactions: (state) => state.transactions,
					$$accounts: (state) => state.accounts,
					$$programs: (state) => state.programs,
					$$tokenAccounts: (state) => state.tokenAccounts,
					$$tokenMints: (state) => state.tokenMints,
				},
			}),

	],
}
