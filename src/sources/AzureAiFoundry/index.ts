// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/AzureAiFoundry/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.AzureAiFoundry,
	label: 'Azure AI Foundry',
	sources: [
		{
			source: Source.AzureAiFoundry_Rest,
			label: 'Azure AI Foundry REST',
		},
	],
	bindings: [bindings[Source.AzureAiFoundry_Rest]],
} satisfies SourceProviderDefinition
