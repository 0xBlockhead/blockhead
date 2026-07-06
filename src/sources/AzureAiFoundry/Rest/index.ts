// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const azureAiFoundryRestSourceDefinition = {
	provider: SourceProvider.AzureAiFoundry,
	source: Source.AzureAiFoundry_Rest,
	label: 'Azure AI Foundry REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default azureAiFoundryRestSourceDefinition
