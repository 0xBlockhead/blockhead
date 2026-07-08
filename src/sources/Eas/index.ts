import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { easBindings } from '$/sources/Eas/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const easOrigins = sourceOriginsFromBindings(easBindings)

const easSourceProviderDefinition = {
	provider: SourceProvider.Eas,
	label: 'Ethereum Attestation Service',
	sources: [
		{
			provider: SourceProvider.Eas,
			source: Source.EasContracts_Evm,
			label: 'EAS contract catalog',
		},
	],
	bindings: easBindings,
	origins: easOrigins,
} satisfies SourceProviderDefinition

export default easSourceProviderDefinition
