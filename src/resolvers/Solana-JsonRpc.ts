import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	SolanaRpcInstruction,
	SolanaRpcTransactionWithMeta,
} from '$/sources/Solana/JsonRpc/types.ts'

const solanaMainnetRpcUrl = 'https://api.mainnet-beta.solana.com'

const assertSolanaMainnet = (network: { namespace: string; reference: string }) => {
	if (network.namespace !== NetworkNamespace.Solana || network.reference !== '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp') {
		throw new Error(`Solana_JsonRpc: unsupported network ${network.namespace}:${network.reference}`)
	}
}

const solanaTransactionFields = (
	network: {
		namespace: string
		reference: string
	},
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
	network: {
		namespace: string
		reference: string
	},
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
	network: {
		namespace: string
		reference: string
	},
	transactionId: {
		$network: {
			namespace: string
			reference: string
		}
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
	$network: {
		namespace: string
		reference: string
	}
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
