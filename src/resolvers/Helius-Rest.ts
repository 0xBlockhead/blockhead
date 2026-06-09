import {
	defineResolver,
	type SourceResolverContext,
} from '$/resolvers/$resolvers.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { HeliusEnhancedTransaction } from '$/sources/Helius/Rest/types.ts'

const assertSolanaMainnet = (network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== 'solana'
		|| network.caip2.reference !== '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
	) {
		throw new Error('Helius_Rest: unsupported network')
	}
}

const heliusTransactionFields = (
	network: { caip2: { namespace: string; reference: string } } | { networkSlug: string },
	transaction: HeliusEnhancedTransaction,
) => ({
	$block: {
		[EntityMetaKey.Id]: {
			$network: network,
			slot: BigInt(transaction.slot),
		},
	},
	slot: BigInt(transaction.slot),
	...(transaction.feePayer != null && {
		$feePayer: {
			[EntityMetaKey.Id]: {
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
		$network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }
		signature: string
	},
	transaction: HeliusEnhancedTransaction,
) => (
	(transaction.instructions ?? []).map((instruction, instructionIndex) => ({
		[EntityMetaKey.Id]: {
			$transaction: transactionId,
			instructionIndex,
		},
		$program: {
			[EntityMetaKey.Id]: {
				$network: transactionId.$network,
				programId: instruction.programId,
			},
		},
		...(instruction.data != null && {
			data: instruction.data,
		}),
		...(instruction.accounts != null && {
			$$accounts: instruction.accounts.map((pubkey) => ({
				[EntityMetaKey.Id]: {
					$network: transactionId.$network,
					pubkey,
				},
			})),
		}),
	}))
)

const getTransaction = async (
	entityId: {
		$network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }
		signature: string
	},
	context: SourceResolverContext<Source.Helius_Rest>,
) => {
	assertSolanaMainnet(entityId.$network)
	const { getEnhancedTransactions } = await import('$/sources/Helius/Rest/queries.ts')
	const transaction = (await getEnhancedTransactions({
		signatures: [entityId.signature],
		publicEnv: context.publicEnv,
	})).find((enhancedTransaction) => enhancedTransaction.signature === entityId.signature)
	if (transaction == null) throw new Error(`Helius_Rest: transaction not found for signature ${entityId.signature}`)
	return transaction
}

export default {
	source: Source.Helius_Rest,

	resolvers: [
		defineResolver(Source.Helius_Rest, {
			entityType: EntityType.SolanaTransaction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const transaction = await getTransaction(
					entityId,
					context,
				)
				return {
					...heliusTransactionFields(
						entityId.$network,
						transaction,
					),
					$$instructions: heliusInstructionRows(
						entityId,
						transaction,
					),
				}
			}
			}
		})({
				fields: {
			$block: (transaction) => transaction.$block,
			slot: (transaction) => transaction.slot,
			$feePayer: (transaction) => transaction.$feePayer,
			feeLamports: (transaction) => transaction.feeLamports,
			status: (transaction) => transaction.status,
			$$instructions: (transaction) => transaction.$$instructions,
		},
			}),

		defineResolver(Source.Helius_Rest, {
			entityType: EntityType.SolanaInstruction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const transaction = await getTransaction(
					entityId.$transaction,
					context,
				)
				const instruction = heliusInstructionRows(
					entityId.$transaction,
					transaction,
				).at(entityId.instructionIndex)
				if (instruction == null) throw new Error(`Helius_Rest: instruction not found for ${entityId.$transaction.signature}:${entityId.instructionIndex}`)
				return instruction
			}
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
				[EntityIdProjection.Identity]: async (entityId, context) => (
				heliusInstructionRows(
					entityId,
					await getTransaction(
						entityId,
						context,
					),
				)
			)
			}
		})({
				fields: {
			$$instructions: (instructions) => instructions,
		},
			}),
	],
}
