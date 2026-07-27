// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/Transmission/bindings.ts'

export default {
	provider: SourceProvider.Transmission,
	label: 'Transmission',
	sources: [
		{
			source: Source.TransmissionRpc_JsonRpc,
			label: 'Transmission RPC',
		},
	],
	bindings: [bindings[Source.TransmissionRpc_JsonRpc]],
} satisfies SourceProviderDefinition
