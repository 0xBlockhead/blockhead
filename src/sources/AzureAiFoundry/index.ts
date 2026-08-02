// Generated from APP.ts.

import bindings from '$/sources/AzureAiFoundry/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.AzureAiFoundry,
	label: 'Azure AI Foundry',
	sources: [
		{
			source: Source.AzureAiFoundry_Rest,
			label: 'Azure AI Foundry REST',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
