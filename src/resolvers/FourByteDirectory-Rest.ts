import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const isErrorSignature = (signature: string) => (
	signature.startsWith('Error(')
	|| signature.startsWith('Panic(')
	|| /^[A-Z][a-zA-Z0-9_]*\(/.test(signature)
)

export default {
	source: Source.FourByteDirectory_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmSelector,
			resolve: {
				Hex: {
					resolve: async ({ hex }) => {
						const { getFunctionEntries } = await import('$/sources/FourByteDirectory/Rest/queries.ts')
						const signatures = (await getFunctionEntries({ hex })).map((entry) => entry.text_signature)
						return { signatures }
					},
				},
			},
		})({
			signatures: (snapshot) => snapshot.signatures,
		}),

		defineResolver({
			entityType: EntityType.EvmTopic,
			resolve: {
				Hex: {
					resolve: async ({ hex }) => {
						const { getEventEntries } = await import('$/sources/FourByteDirectory/Rest/queries.ts')
						const signatures = (await getEventEntries({ hex })).map((entry) => entry.text_signature)
						return { signatures }
					},
				},
			},
		})({
			signatures: (snapshot) => snapshot.signatures,
		}),

		defineResolver({
			entityType: EntityType.EvmError,
			resolve: {
				Hex: {
					resolve: async ({ hex }) => {
						const { getFunctionEntries } = await import('$/sources/FourByteDirectory/Rest/queries.ts')
						const signatures = (
							await getFunctionEntries({ hex })
						).map((entry) => entry.text_signature).filter(isErrorSignature)
						return { signatures }
					},
				},
			},
		})({
			signatures: (snapshot) => snapshot.signatures,
		}),
	],
} satisfies RegisteredSourceResolverModule
