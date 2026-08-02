import { networkBySlug } from '$/constants/Network.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.StellarExpert,

	resolvers: [
		defineResolver({
			entityType: EntityType.StellarLedger,
			resolve: {
				NetworkSequence: {
					resolve: async ({ $network, sequence }) => {
						if ($network.$network.slug !== networkBySlug.stellar.slug)
							throw new Error('StellarExpert: unsupported network')

						if (sequence < 1n || sequence > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('StellarExpert: ledger sequence is not a positive safe integer')

						const { getTimestampFromSequence } = await import('$/sources/StellarExpert/Rest/queries.ts')
						const ledger = await getTimestampFromSequence({
							network: 'public',
							sequence: Number(sequence),
						})

						if (
							ledger.sequence == null
							|| !Number.isSafeInteger(ledger.sequence)
							|| BigInt(ledger.sequence) !== sequence
						)
							throw new Error('StellarExpert: response ledger sequence does not match request')

						if (
							ledger.timestamp == null
							|| !Number.isSafeInteger(ledger.timestamp)
							|| ledger.timestamp < 0
							|| !Number.isSafeInteger(ledger.timestamp * 1_000)
						)
							throw new Error('StellarExpert: invalid ledger timestamp')

						const closeTimeMs = ledger.timestamp * 1_000
						if (ledger.date == null || Date.parse(ledger.date) !== closeTimeMs)
							throw new Error('StellarExpert: ledger date does not match timestamp')

						return { closeTimeMs }
					},
				},
			},
		})({
			closeTimeMs: (ledger) => ledger.closeTimeMs,
		}),
	],
} satisfies RegisteredSourceResolverModule<Source.StellarExpert>
