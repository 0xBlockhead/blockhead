import {
	defineResolver,
	type SourceResolverContext,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { HeliusEnhancedTransaction } from '$/sources/Helius/Rest/types.ts'
import { SolanaInstructionKind } from '$/schema/SolanaInstruction.ts'

const assertSolanaMainnet = (network: { caip2: { namespace: string; reference: string } } | { slug: string }) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== 'solana'
		|| network.caip2.reference !== '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
	) {
		throw new Error('Helius_Rest: unsupported network')
	}
}

const heliusTransactionFields = (
	network: { caip2: { namespace: string; reference: string } } | { slug: string },
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
		$network: { caip2: { namespace: string; reference: string } } | { slug: string }
		signature: string
	},
	transaction: HeliusEnhancedTransaction
) => ({
	[EntityMetaKey.Selector]: {
		$transaction: transactionId,
		slot: BigInt(transaction.slot),
		source: Source.Helius_Rest,
	},
	$transaction: {
		[EntityMetaKey.Selector]: transactionId,
	},
	slot: BigInt(transaction.slot),
	source: Source.Helius_Rest,
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
		$network: { caip2: { namespace: string; reference: string } } | { slug: string }
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
		$network: { caip2: { namespace: string; reference: string } } | { slug: string }
		signature: string
	},
	context: SourceResolverContext<Source.Helius_Rest>
) => {
	assertSolanaMainnet($network)
	const { getEnhancedTransactions } = await import('$/sources/Helius/Rest/queries.ts')
	const transaction = (await getEnhancedTransactions({
		signatures: [signature],
		publicEnv: context.publicEnv,
	})).find((enhancedTransaction) => enhancedTransaction.signature === signature)
	if (transaction == null) throw new Error(`Helius_Rest: transaction not found for signature ${signature}`)
	return transaction
}

export default {
	source: Source.Helius_Rest,

	resolvers: [
		defineResolver(Source.Helius_Rest, {
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

		defineResolver(Source.Helius_Rest, {
			entityType: EntityType.SolanaTransaction_Timestamp,
			resolve: {
				TransactionSlotSource: {
					resolve: async ({ $transaction, slot, source }, context) => {
						if (source !== Source.Helius_Rest) throw new Error(`Helius_Rest: unsupported source ${source}`)
						const transaction = await getTransaction(
							$transaction,
							context
						)
						if (BigInt(transaction.slot) !== slot) throw new Error('Helius_Rest: SolanaTransaction_Timestamp id does not match transaction slot')
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

		defineResolver(Source.Helius_Rest, {
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
						if (instruction == null) throw new Error(`Helius_Rest: instruction not found for ${$transaction.signature}:${String(indexInTransaction)}`)
						return instruction
					},
				},
			}
		})({
				instructionKind: (instruction) => instruction.instructionKind,
				indexInTransaction: (instruction) => instruction.indexInTransaction,
				$program: (instruction) => instruction.$program,
				indexInInstruction: () => undefined,
				data: (instruction) => instruction.data,
				$$accounts: (instruction) => instruction.$$accounts,
			}),

		defineResolver(Source.Helius_Rest, {
			entityType: EntityType.SolanaTransaction,
			resolve: {
				NetworkSignature: {
					resolve: async (entitySelector, context) => (
						heliusInstructionRows(
							entitySelector,
							await getTransaction(
								entitySelector,
								context
							)
						)
					),
				},
			}
		})({
				$$instructions: (instructions) => instructions.map((instruction) => ({
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
	],
}
