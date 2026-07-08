import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { lightningLndBindings } from '$/sources/LightningLnd/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const lightningLndOrigins = sourceOriginsFromBindings(lightningLndBindings)

const lightningLndSourceProviderDefinition = {
	provider: SourceProvider.LightningLnd,
	label: 'LND',
	sources: [
		{
			provider: SourceProvider.LightningLnd,
			source: Source.LightningLnd_Grpc,
			label: 'LND gRPC',
		},
		{
			provider: SourceProvider.LightningLnd,
			source: Source.LightningLnd_Rest,
			label: 'LND REST',
		},
	],
	bindings: lightningLndBindings,
	origins: lightningLndOrigins,
} satisfies SourceProviderDefinition

export default lightningLndSourceProviderDefinition
