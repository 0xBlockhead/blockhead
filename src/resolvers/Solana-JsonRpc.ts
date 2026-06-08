import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { caip2ByNetworkSlug } from '$/constants/Network.ts'
import { solanaMainnetRpcEndpoints } from '$/constants/SolanaNetwork.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	SolanaRpcInstruction,
	SolanaRpcTransactionWithMeta,
	SolanaRpcVoteAccounts,
} from '$/sources/Solana/JsonRpc/types.ts'

const solanaMainnetRpcUrl = solanaMainnetRpcEndpoints[0].url
const solanaMainnetCaip2 = caip2ByNetworkSlug.solana

const assertSolanaMainnet = (network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== solanaMainnetCaip2.namespace
		|| network.caip2.reference !== solanaMainnetCaip2.reference
	) {
		throw new Error('Solana_JsonRpc: unsupported network')
	}
}

const solanaTransactionFields = (
	network: { caip2: { namespace: string; reference: string } } | { networkSlug: string },
	transaction: SolanaRpcTransactionWithMeta,
	slot?: bigint,
) => ({
	...(slot != null && {
		$block: {
			[EntityMetaKey.Id]: {
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
						[EntityMetaKey.Id]: {
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
	network: { caip2: { namespace: string; reference: string } } | { networkSlug: string },
	instruction: SolanaRpcInstruction,
) => ({
	$program: {
		[EntityMetaKey.Id]: {
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
	...(instruction.accounts != null && {
		$$accounts: instruction.accounts.map((pubkey) => ({
			[EntityMetaKey.Id]: {
				$network: network,
				pubkey,
			},
		})),
	}),
})

const solanaInstructionRows = (
	network: { caip2: { namespace: string; reference: string } } | { networkSlug: string },
	transactionId: {
		$network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }
		signature: string
	},
	transaction: SolanaRpcTransactionWithMeta,
) => [
	...transaction.transaction.message.instructions.map((instruction, instructionIndex) => ({
		[EntityMetaKey.Id]: {
			$transaction: transactionId,
			instructionIndex,
		},
		...solanaInstructionFields(
			network,
			instruction,
		),
	})),
	...(transaction.meta?.innerInstructions ?? [])
		.flatMap((innerInstructionGroup) => (
			innerInstructionGroup.instructions.map((instruction, innerInstructionIndex) => ({
				[EntityMetaKey.Id]: {
					$transaction: transactionId,
					instructionIndex: innerInstructionGroup.index,
					innerInstructionIndex,
				},
				...solanaInstructionFields(
					network,
					instruction,
				),
			}))
		)),
]

const getTransaction = async (entityId: {
	$network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }
	signature: string
}) => {
	assertSolanaMainnet(entityId.$network)
	const { getTransaction } = await import('$/sources/Solana/JsonRpc/queries.ts')
	const transaction = await getTransaction({
		rpcUrl: solanaMainnetRpcUrl,
		signature: entityId.signature,
	})
	if (transaction == null) throw new Error(`Solana_JsonRpc: transaction not found for signature ${entityId.signature}`)
	return transaction
}

const solanaValidatorRows = (
	network: { caip2: { namespace: string; reference: string } } | { networkSlug: string },
	voteAccounts: SolanaRpcVoteAccounts,
) => (
	[
		...voteAccounts.current.map((voteAccount) => ({
			[EntityMetaKey.Id]: {
				$network: network,
				votePubkey: voteAccount.votePubkey,
			},
			nodePubkey: voteAccount.nodePubkey,
			activatedStakeLamports: BigInt(voteAccount.activatedStake),
			commission: voteAccount.commission,
			delinquent: false,
		})),
		...voteAccounts.delinquent.map((voteAccount) => ({
			[EntityMetaKey.Id]: {
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
		defineResolver({
				entityType: EntityType.SolanaBlock,
				resolve: {
					[EntityIdProjection.Identity]: async (entityId) => {
					assertSolanaMainnet(entityId.$network)
					if (!('slot' in entityId))
						throw new Error('Solana_JsonRpc: SolanaBlock blockHash lookup is unsupported')

					const { getBlock } = await import('$/sources/Solana/JsonRpc/queries.ts')
				const block = await getBlock({
					rpcUrl: solanaMainnetRpcUrl,
					slot: entityId.slot,
				})
				if (block == null) throw new Error(`Solana_JsonRpc: block not found for slot ${entityId.slot.toString()}`)
				return {
					...(block.blockHeight != null && {
						blockHeight: BigInt(block.blockHeight),
					}),
					blockHash: block.blockhash,
					previousBlockHash: block.previousBlockhash,
					$parent: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
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
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									signature,
								},
								...solanaTransactionFields(
									entityId.$network,
									transaction,
									entityId.slot,
								),
							},
						]
					}),
				}
			}
				},
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

		defineResolver({
			entityType: EntityType.SolanaNetwork_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertSolanaMainnet(entityId.$network)
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

		defineResolver({
			entityType: EntityType.SolanaTransaction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const transaction = await getTransaction(entityId)
				return {
					...solanaTransactionFields(
						entityId.$network,
						transaction,
						BigInt(transaction.slot),
					),
					$$instructions: solanaInstructionRows(
						entityId.$network,
						entityId,
						transaction,
					),
				}
			}
			},
			fields: {
				$block: (transaction) => transaction.$block,
				$feePayer: (transaction) => transaction.$feePayer,
				slot: (transaction) => transaction.slot,
				feeLamports: (transaction) => transaction.feeLamports,
				computeUnitsConsumed: (transaction) => transaction.computeUnitsConsumed,
				status: (transaction) => transaction.status,
				$$instructions: (transaction) => transaction.$$instructions,
			},
		}),

		defineResolver({
			entityType: EntityType.SolanaInstruction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const transaction = await getTransaction(entityId.$transaction)
				const instruction = (
					entityId.innerInstructionIndex == null ?
						transaction.transaction.message.instructions[entityId.instructionIndex]
					:
						transaction.meta?.innerInstructions
							?.find((innerInstructionGroup) => innerInstructionGroup.index === entityId.instructionIndex)
							?.instructions[entityId.innerInstructionIndex]
				)
				if (instruction == null) throw new Error(`Solana_JsonRpc: instruction not found for ${entityId.$transaction.signature}`)
				return solanaInstructionFields(
					entityId.$transaction.$network,
					instruction,
				)
			}
			},
			fields: {
				$program: (instruction) => instruction.$program,
				parsedType: (instruction) => instruction.parsedType,
				data: (instruction) => instruction.data,
				$$accounts: (instruction) => instruction.$$accounts,
			},
		}),

		defineResolver({
			entityType: EntityType.SolanaAccount,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertSolanaMainnet(entityId.$network)
				const { getAccountInfo } = await import('$/sources/Solana/JsonRpc/queries.ts')
				const accountInfo = await getAccountInfo({
					rpcUrl: solanaMainnetRpcUrl,
					pubkey: entityId.pubkey,
				})
				if (accountInfo.value == null) throw new Error(`Solana_JsonRpc: account not found for pubkey ${entityId.pubkey}`)
				return {
					$ownerProgram: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
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
			fields: {
				$ownerProgram: (account) => account.$ownerProgram,
				lamports: (account) => account.lamports,
				rentEpoch: (account) => account.rentEpoch,
				executable: (account) => account.executable,
				dataEncoding: (account) => account.dataEncoding,
			},
		}),

		defineResolver({
			entityType: EntityType.SolanaProgram,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertSolanaMainnet(entityId.$network)
				return {
					$programAccount: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							pubkey: entityId.programId,
						},
					},
				}
			}
			},
			fields: {
				$programAccount: (program) => program.$programAccount,
			},
		}),

		defineResolver({
			entityType: EntityType.SolanaTokenMint,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertSolanaMainnet(entityId.$network)
				const { getParsedTokenMintAccountInfo } = await import('$/sources/Solana/JsonRpc/queries.ts')
				const accountInfo = await getParsedTokenMintAccountInfo({
					rpcUrl: solanaMainnetRpcUrl,
					pubkey: entityId.mintAddress,
				})
				if (accountInfo.value == null) throw new Error(`Solana_JsonRpc: token mint not found for address ${entityId.mintAddress}`)
				return {
					supply: BigInt(accountInfo.value.data.parsed.info.supply),
					decimals: accountInfo.value.data.parsed.info.decimals,
					...(accountInfo.value.data.parsed.info.mintAuthority != null && {
						$mintAuthority: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								pubkey: accountInfo.value.data.parsed.info.mintAuthority,
							},
						},
					}),
					...(accountInfo.value.data.parsed.info.freezeAuthority != null && {
						$freezeAuthority: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								pubkey: accountInfo.value.data.parsed.info.freezeAuthority,
							},
						},
					}),
				}
			}
			},
			fields: {
				supply: (mint) => mint.supply,
				decimals: (mint) => mint.decimals,
				$mintAuthority: (mint) => mint.$mintAuthority,
				$freezeAuthority: (mint) => mint.$freezeAuthority,
			},
		}),

		defineResolver({
			entityType: EntityType.SolanaValidator,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertSolanaMainnet(entityId.$network)
				const { getVoteAccounts } = await import('$/sources/Solana/JsonRpc/queries.ts')
				const voteAccounts = await getVoteAccounts({
					rpcUrl: solanaMainnetRpcUrl,
					votePubkey: entityId.votePubkey,
				})
				const currentVoteAccount = voteAccounts.current.find((voteAccount) => (
					voteAccount.votePubkey === entityId.votePubkey
				))
				const delinquentVoteAccount = voteAccounts.delinquent.find((voteAccount) => (
					voteAccount.votePubkey === entityId.votePubkey
				))
				const voteAccount = currentVoteAccount ?? delinquentVoteAccount
				if (voteAccount == null) throw new Error(`Solana_JsonRpc: validator vote account not found for ${entityId.votePubkey}`)
				return {
					nodePubkey: voteAccount.nodePubkey,
					activatedStakeLamports: BigInt(voteAccount.activatedStake),
					commission: voteAccount.commission,
					delinquent: delinquentVoteAccount != null,
				}
			}
			},
			fields: {
				nodePubkey: (validator) => validator.nodePubkey,
				activatedStakeLamports: (validator) => validator.activatedStakeLamports,
				commission: (validator) => validator.commission,
				delinquent: (validator) => validator.delinquent,
			},
		}),

		defineResolver({
			entityType: EntityType.SolanaNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertSolanaMainnet(entityId)
				return [
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: Date.now(),
						},
					},
				]
			}
			},
			fields: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver({
			entityType: EntityType.SolanaNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				assertSolanaMainnet(entityId)
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
						[EntityMetaKey.Id]: {
							$network: entityId,
							slot: BigInt(slot),
						},
					}))
			}
			},
			fields: {
				$$blocks: (blocks) => blocks,
			},
		}),

		defineResolver({
			entityType: EntityType.SolanaNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertSolanaMainnet(entityId)
				const { getVoteAccounts } = await import('$/sources/Solana/JsonRpc/queries.ts')
				return solanaValidatorRows(
					entityId,
					await getVoteAccounts({
						rpcUrl: solanaMainnetRpcUrl,
					}),
				)
			}
			},
			fields: {
				$$validators: (validators) => validators,
			},
		}),

		defineResolver({
			entityType: EntityType.SolanaNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				assertSolanaMainnet(entityId)
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
							})),
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
									[EntityMetaKey.Id]: {
										$network: entityId,
											signature,
									},
									...solanaTransactionFields(
										entityId,
										transaction,
										slot,
									),
								},
							]
							}) ?? []
					))
					.slice(0, limit)
			}
			},
			fields: {
				$$transactions: (transactions) => transactions,
			},
		}),

		defineResolver({
			entityType: EntityType.SolanaNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				assertSolanaMainnet(entityId)
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
									)),
							)
						).flat(),
					),
				]
					.slice(0, limit)
					.map((pubkey) => ({
						[EntityMetaKey.Id]: {
							$network: entityId,
							pubkey,
						},
					}))
			}
			},
			fields: {
				$$accounts: (accounts) => accounts,
			},
		}),

		defineResolver({
			entityType: EntityType.SolanaBlock,
				resolve: {
					[EntityIdProjection.Identity]: async (entityId) => {
					assertSolanaMainnet(entityId.$network)
					if (!('slot' in entityId))
						throw new Error('Solana_JsonRpc: SolanaBlock.$$transactions blockHash lookup is unsupported')

					const { getBlock } = await import('$/sources/Solana/JsonRpc/queries.ts')
				const block = await getBlock({
					rpcUrl: solanaMainnetRpcUrl,
					slot: entityId.slot,
				})
				if (block == null) throw new Error(`Solana_JsonRpc: block not found for slot ${entityId.slot.toString()}`)
					return block.transactions.flatMap((transaction) => {
						const signature = transaction.transaction.signatures.at(0)
						return signature == null ?
						[]
					:
						[
						{
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
									signature,
							},
							...solanaTransactionFields(
								entityId.$network,
								transaction,
								entityId.slot,
							),
						},
					]
					})
			}
				},
			fields: {
				$$transactions: (transactions) => transactions,
			},
		}),

		defineResolver({
			entityType: EntityType.SolanaTransaction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => (
				solanaInstructionRows(
					entityId.$network,
					entityId,
					await getTransaction(entityId),
				)
			)
			},
			fields: {
				$$instructions: (instructions) => instructions,
			},
		}),
	],
}
