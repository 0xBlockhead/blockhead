import {
	defineResolver,
	type SourceResolverContext,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { HeliusEnhancedTransaction } from '$/sources/Helius/Rest/types.ts'
import { SolanaTransactionSelector } from '$/schema/SolanaTransaction.ts'
import { SolanaInstructionKind, SolanaInstructionSelector } from '$/schema/SolanaInstruction.ts'

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
	slot: BigInt(transaction.slot),
	...(transaction.feePayer != null && {
		$feePayer: {
			[EntityMetaKey.Selector]: {
				$network: network,
				pubkey: transaction.feePayer,
			},
		},
	}),
	...(transaction.fee != null && {
		feeLamports: BigInt(transaction.fee),
	}),
	status: transaction.transactionError == null ? 'success' : 'failed',
})

const heliusInstructionRows = (
	transactionId: {
		$network: { caip2: { namespace: string; reference: string } } | { slug: string }
		signature: string
	},
	transaction: HeliusEnhancedTransaction
) => (
	(transaction.instructions ?? []).map((instruction, instructionIndex) => ({
		[EntityMetaKey.Selector]: {
			$transaction: transactionId,
			instructionKind: SolanaInstructionKind.Instruction,
			instructionIndex,
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
				[SolanaTransactionSelector.NetworkSignature]: async (entitySelector, context) => {
					const transaction = await getTransaction(
						entitySelector,
						context
					)
					return {
						...heliusTransactionFields(
							entitySelector.$network,
							transaction
						),
						$$instructions: heliusInstructionRows(
							entitySelector,
							transaction
						),
					}
				},
			}
		})({
			fields: {
				$block: (transaction) => transaction.$block,
				slot: (transaction) => transaction.slot,
				$feePayer: (transaction) => transaction.$feePayer,
				feeLamports: (transaction) => transaction.feeLamports,
				status: (transaction) => transaction.status,
				$$instructions: (transaction) => transaction.$$instructions.map((instruction) => ({
					[EntityMetaKey.Selector]: instruction[EntityMetaKey.Selector],
				})),
			},
		}),

		defineResolver(Source.Helius_Rest, {
			entityType: EntityType.SolanaInstruction,
			resolve: {
				[SolanaInstructionSelector.SolanaTransactionInstruction]: async ({ $transaction, instructionIndex }, context) => {
					const transaction = await getTransaction(
						$transaction,
						context
					)
					const instruction = heliusInstructionRows(
						$transaction,
						transaction
					).find((instruction) => instruction[EntityMetaKey.Selector].instructionIndex === instructionIndex)
					if (instruction == null) throw new Error(`Helius_Rest: instruction not found for ${$transaction.signature}:${String(instructionIndex)}`)
					return instruction
				},
			}
		})({
			fields: {
				$program: (instruction) => instruction.$program,
				data: (instruction) => instruction.data,
				$$accounts: (instruction) => instruction.$$accounts,
			},
		}),

		defineResolver(Source.Helius_Rest, {
			entityType: EntityType.SolanaTransaction,
			resolve: {
				[SolanaTransactionSelector.NetworkSignature]: async (entitySelector, context) => (
					heliusInstructionRows(
						entitySelector,
						await getTransaction(
							entitySelector,
							context
						)
					)
				),
			}
		})({
			fields: {
				$$instructions: (instructions) => instructions.map((instruction) => ({
					[EntityMetaKey.Selector]: instruction[EntityMetaKey.Selector],
				})),
			},
		}),
	],
}
