// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/LightningLnd/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.LightningLnd,
	label: 'LND',
	sources: [
		{
			source: Source.LightningLnd_Grpc,
			label: 'LND gRPC',
		},
		{
			source: Source.LightningLnd_Rest,
			label: 'LND REST',
		},
	],
	bindings: [
		bindings[Source.LightningLnd_Grpc],
		bindings[Source.LightningLnd_Rest],
	],
} satisfies SourceProviderDefinition
