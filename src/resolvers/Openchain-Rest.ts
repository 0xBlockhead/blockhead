import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

type SignatureObservation = {
	signatures: string[]
	filteredSignatureCount?: number
	verifiedCandidateCount?: number
	reachable: boolean
}

const getFunctionObservation = async (hex: `0x${string}`): Promise<SignatureObservation> => {
	const {
		getFourbyteFunctionEntries,
		getFunctionEntries,
		summarizeOpenchainEntries,
	} = await import('$/sources/Openchain/Rest/queries.ts')
	const openchainEntries = await getFunctionEntries({ hex })
	if (openchainEntries.length > 0)
		return {
			...summarizeOpenchainEntries(openchainEntries),
			reachable: true,
		}

	return {
		signatures: (
			await getFourbyteFunctionEntries({ hex })
		)
			.map((signatureEntry) => signatureEntry.text_signature),
		reachable: true,
	}
}

const getEventObservation = async (hex: `0x${string}`): Promise<SignatureObservation> => {
	const {
		getEventEntries,
		getFourbyteEventEntries,
		summarizeOpenchainEntries,
	} = await import('$/sources/Openchain/Rest/queries.ts')
	const openchainEntries = await getEventEntries({ hex })
	if (openchainEntries.length > 0)
		return {
			...summarizeOpenchainEntries(openchainEntries),
			reachable: true,
		}

	return {
		signatures: (
			await getFourbyteEventEntries({ hex })
		)
			.map((signatureEntry) => signatureEntry.text_signature),
		reachable: true,
	}
}

const isErrorSignature = (signature: string) => (
	signature.startsWith('Error(')
	|| signature.startsWith('Panic(')
	|| /^[A-Z][a-zA-Z0-9_]*\(/.test(signature)
)

const getErrorObservation = async (hex: `0x${string}`): Promise<SignatureObservation> => {
	const {
		getFourbyteFunctionEntries,
		getFunctionEntries,
		summarizeOpenchainEntries,
	} = await import('$/sources/Openchain/Rest/queries.ts')
	const openchainEntries = await getFunctionEntries({ hex })
	if (openchainEntries.length > 0)
		return {
			...summarizeOpenchainEntries(
				openchainEntries.filter((entry) => isErrorSignature(entry.name))
			),
			reachable: true,
		}

	return {
		signatures: (
			await getFourbyteFunctionEntries({ hex })
		)
			.map((signatureEntry) => signatureEntry.text_signature)
			.filter(isErrorSignature),
		reachable: true,
	}
}

const unreachableObservation = (): SignatureObservation => ({
	signatures: [],
	reachable: false,
})

export default {
	source: Source.Openchain_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmSelector,
			resolve: {
				Hex: {
					resolve: async ({ hex }) => {
						const observation = await getFunctionObservation(hex)
						return {
							signatures: observation.signatures,
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$selector: { hex },
										timestampMs: Date.now(),
										source: Source.Openchain_Rest,
									},
								},
							],
						}
					},
				},
			},
		})({
			signatures: (snapshot) => snapshot.signatures,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.EvmSelector_Timestamp,
			resolve: {
				SelectorTimestampMsSource: {
					resolve: async ({ $selector }) => {
						try {
							return await getFunctionObservation($selector.hex)
						} catch {
							return unreachableObservation()
						}
					},
				},
			},
		})({
			signatures: (snapshot) => snapshot.signatures,
			filteredSignatureCount: (snapshot) => snapshot.filteredSignatureCount,
			verifiedCandidateCount: (snapshot) => snapshot.verifiedCandidateCount,
			reachable: (snapshot) => snapshot.reachable,
		}),

		defineResolver({
			entityType: EntityType.EvmTopic,
			resolve: {
				Hex: {
					resolve: async ({ hex }) => {
						const observation = await getEventObservation(hex)
						return {
							signatures: observation.signatures,
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$topic: { hex },
										timestampMs: Date.now(),
										source: Source.Openchain_Rest,
									},
								},
							],
						}
					},
				},
			},
		})({
			signatures: (snapshot) => snapshot.signatures,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.EvmTopic_Timestamp,
			resolve: {
				TopicTimestampMsSource: {
					resolve: async ({ $topic }) => {
						try {
							return await getEventObservation($topic.hex)
						} catch {
							return unreachableObservation()
						}
					},
				},
			},
		})({
			signatures: (snapshot) => snapshot.signatures,
			filteredSignatureCount: (snapshot) => snapshot.filteredSignatureCount,
			verifiedCandidateCount: (snapshot) => snapshot.verifiedCandidateCount,
			reachable: (snapshot) => snapshot.reachable,
		}),

		defineResolver({
			entityType: EntityType.EvmError,
			resolve: {
				Hex: {
					resolve: async ({ hex }) => {
						const observation = await getErrorObservation(hex)
						return {
							signatures: observation.signatures,
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$error: { hex },
										timestampMs: Date.now(),
										source: Source.Openchain_Rest,
									},
								},
							],
						}
					},
				},
			},
		})({
			signatures: (snapshot) => snapshot.signatures,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.EvmError_Timestamp,
			resolve: {
				ErrorTimestampMsSource: {
					resolve: async ({ $error }) => {
						try {
							return await getErrorObservation($error.hex)
						} catch {
							return unreachableObservation()
						}
					},
				},
			},
		})({
			signatures: (snapshot) => snapshot.signatures,
			filteredSignatureCount: (snapshot) => snapshot.filteredSignatureCount,
			verifiedCandidateCount: (snapshot) => snapshot.verifiedCandidateCount,
			reachable: (snapshot) => snapshot.reachable,
		}),
	],
} satisfies RegisteredSourceResolverModule
