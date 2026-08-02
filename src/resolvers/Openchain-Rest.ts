import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getFunctionSignatures = async (hex: `0x${string}`) => {
	const {
		getFourbyteFunctionEntries,
		getFunctionEntries,
	} = await import('$/sources/Openchain/Rest/queries.ts')
	const openchainEntries = await getFunctionEntries({ hex })
	return openchainEntries.length > 0 ?
		openchainEntries.map((signatureEntry) => signatureEntry.name)
	:
		(await getFourbyteFunctionEntries({ hex })).map((signatureEntry) => signatureEntry.text_signature)
}

const getEventSignatures = async (hex: `0x${string}`) => {
	const {
		getEventEntries,
		getFourbyteEventEntries,
	} = await import('$/sources/Openchain/Rest/queries.ts')
	const openchainEntries = await getEventEntries({ hex })
	return openchainEntries.length > 0 ?
		openchainEntries.map((signatureEntry) => signatureEntry.name)
	:
		getFourbyteEventEntries({ hex })
			.then((signatureEntries) => (
				signatureEntries.map((signatureEntry) => signatureEntry.text_signature)
			))
}

const getErrorSignatures = async (hex: `0x${string}`) => (
	(await getFunctionSignatures(hex)).filter((signature) => (
		signature.startsWith('Error(')
		|| signature.startsWith('Panic(')
		|| /^[A-Z][a-zA-Z0-9_]*\(/.test(signature)
	))
)

export default {
	source: Source.Openchain_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmSelector,
			resolve: {
				Hex: {
					resolve: async ({ hex }) => ({
						signatures: await getFunctionSignatures(hex),
						$$timestamps: [
							{
								[EntityMetaKey.Selector]: {
									$selector: { hex },
									timestampMs: Date.now(),
									source: Source.Openchain_Rest,
								},
							},
						],
					}),
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
					resolve: async ({ $selector }) => ({
						signatures: await getFunctionSignatures($selector.hex),
					}),
				},
			},
		})({
			signatures: (snapshot) => snapshot.signatures,
		}),

		defineResolver({
			entityType: EntityType.EvmTopic,
			resolve: {
				Hex: {
					resolve: async ({ hex }) => ({
						signatures: await getEventSignatures(hex),
						$$timestamps: [
							{
								[EntityMetaKey.Selector]: {
									$topic: { hex },
									timestampMs: Date.now(),
									source: Source.Openchain_Rest,
								},
							},
						],
					}),
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
						return getEventSignatures($topic.hex)
							.then((signatures) => ({
								signatures,
								reachable: true,
							}))
							.catch(() => ({
								signatures: [],
								reachable: false,
							}))
					},
				},
			},
		})({
			signatures: (snapshot) => snapshot.signatures,
			filteredSignatureCount: () => undefined,
			verifiedCandidateCount: () => undefined,
			reachable: (snapshot) => snapshot.reachable,
		}),

		defineResolver({
			entityType: EntityType.EvmError,
			resolve: {
				Hex: {
					resolve: async ({ hex }) => ({
						signatures: await getErrorSignatures(hex),
						$$timestamps: [
							{
								[EntityMetaKey.Selector]: {
									$error: { hex },
									timestampMs: Date.now(),
									source: Source.Openchain_Rest,
								},
							},
						],
					}),
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
						return getErrorSignatures($error.hex)
							.then((signatures) => ({
								signatures,
								reachable: true,
							}))
							.catch(() => ({
								signatures: [],
								reachable: false,
							}))
					},
				},
			},
		})({
			signatures: (snapshot) => snapshot.signatures,
			reachable: (snapshot) => snapshot.reachable,
		}),
	],
} satisfies RegisteredSourceResolverModule
