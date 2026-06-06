import {
	defineEntityFieldResolver,
	defineEntityResolver,
	sourcePublicEnv,
	type ResolverLoadSubset,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
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
	context: ResolverLoadSubset | undefined,
) => {
	assertSolanaMainnet(entityId.$network)
	const { getEnhancedTransactions } = await import('$/sources/Helius/Rest/queries.ts')
	const transaction = (await getEnhancedTransactions({
		signatures: [entityId.signature],
		publicEnv: sourcePublicEnv(context, Source.Helius_Rest),
	})).find((enhancedTransaction) => enhancedTransaction.signature === entityId.signature)
	if (transaction == null) throw new Error(`Helius_Rest: transaction not found for signature ${entityId.signature}`)
	return transaction
}

export default {
	source: Source.Helius_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.SolanaTransaction,
			resolve: async (entityId, context) => {
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.SolanaInstruction,
			resolve: async (entityId, context) => {
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
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.SolanaTransaction,
			fieldName: '$$instructions',
			resolve: async (entityId, context) => (
				heliusInstructionRows(
					entityId,
					await getTransaction(
						entityId,
						context,
					),
				)
			),
		}),
	],
}
