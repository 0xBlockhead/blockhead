import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	SolanaRpcInstruction,
	SolanaRpcTransactionWithMeta,
	SolanaRpcVoteAccounts,
} from '$/sources/Solana/JsonRpc/types.ts'

const solanaMainnetRpcUrl = 'https://api.mainnet-beta.solana.com'

const assertSolanaMainnet = (network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== 'solana'
		|| network.caip2.reference !== '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
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
		:	{
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
	programId: instruction.programId,
	...(instruction.parsed?.type != null && {
		parsedType: instruction.parsed.type,
	}),
	...(instruction.data != null && {
		data: instruction.data,
	}),
	...(instruction.accounts != null && {
		accounts: instruction.accounts,
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

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.SolanaBlock,
			resolve: async (entityId) => {
				assertSolanaMainnet(entityId.$network)
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
					$$transactions: block.transactions.flatMap((transaction) => (
						transaction.transaction.signatures[0] == null ?
							[]
						:	[
							{
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									signature: transaction.transaction.signatures[0],
								},
								...solanaTransactionFields(
									entityId.$network,
									transaction,
									entityId.slot,
								),
							},
						]
					)),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.SolanaNetwork_Timestamp,
			resolve: async (entityId) => {
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.SolanaTransaction,
			resolve: async (entityId) => {
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.SolanaInstruction,
			resolve: async (entityId) => {
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.SolanaAccount,
			resolve: async (entityId) => {
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.SolanaProgram,
			resolve: async (entityId) => {
				assertSolanaMainnet(entityId.$network)
				return {
					$programAccount: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							pubkey: entityId.programId,
						},
					},
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.SolanaTokenMint,
			resolve: async (entityId) => {
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.SolanaValidator,
			resolve: async (entityId) => {
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
			},
		}),
	],

	entityFieldResolvers: [

		defineEntityFieldResolver({
			entityType: EntityType.SolanaNetwork,
			fieldName: '$headBlock',
			resolve: async (entityId) => {
				assertSolanaMainnet(entityId)
				const { getSlot } = await import('$/sources/Solana/JsonRpc/queries.ts')
				return {
					[EntityMetaKey.Id]: {
						$network: entityId,
						slot: BigInt(await getSlot({
							rpcUrl: solanaMainnetRpcUrl,
						})),
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SolanaNetwork,
			fieldName: '$$timestamps',
			resolve: async (entityId) => {
				assertSolanaMainnet(entityId)
				return [
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: Date.now(),
						},
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SolanaNetwork,
			fieldName: '$$blocks',
			resolve: async (entityId, context) => {
				assertSolanaMainnet(entityId)
				const {
					getBlocks,
					getSlot,
				} = await import('$/sources/Solana/JsonRpc/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				const endSlot = BigInt(await getSlot({
					rpcUrl: solanaMainnetRpcUrl,
				}))
				return (await getBlocks({
					rpcUrl: solanaMainnetRpcUrl,
					startSlot: endSlot > BigInt(limit - 1) ? endSlot - BigInt(limit - 1) : 0n,
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SolanaNetwork,
			fieldName: '$$validators',
			resolve: async (entityId) => {
				assertSolanaMainnet(entityId)
				const { getVoteAccounts } = await import('$/sources/Solana/JsonRpc/queries.ts')
				return solanaValidatorRows(
					entityId,
					await getVoteAccounts({
						rpcUrl: solanaMainnetRpcUrl,
					}),
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SolanaBlock,
			fieldName: '$$transactions',
			resolve: async (entityId) => {
				assertSolanaMainnet(entityId.$network)
				const { getBlock } = await import('$/sources/Solana/JsonRpc/queries.ts')
				const block = await getBlock({
					rpcUrl: solanaMainnetRpcUrl,
					slot: entityId.slot,
				})
				if (block == null) throw new Error(`Solana_JsonRpc: block not found for slot ${entityId.slot.toString()}`)
				return block.transactions.flatMap((transaction) => (
					transaction.transaction.signatures[0] == null ?
						[]
					:	[
						{
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								signature: transaction.transaction.signatures[0],
							},
							...solanaTransactionFields(
								entityId.$network,
								transaction,
								entityId.slot,
							),
						},
					]
				))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SolanaTransaction,
			fieldName: '$$instructions',
			resolve: async (entityId) => (
				solanaInstructionRows(
					entityId.$network,
					entityId,
					await getTransaction(entityId),
				)
			),
		}),
	],
}
