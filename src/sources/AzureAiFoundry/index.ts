import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { azureAiFoundryBindings } from '$/sources/AzureAiFoundry/bindings.ts'

export default {
	provider: SourceProvider.AzureAiFoundry,
	label: 'Azure AI Foundry',
	sources: [
		{
			provider: SourceProvider.AzureAiFoundry,
			source: Source.AzureAiFoundry_Rest,
			label: 'Azure AI Foundry REST',
		},
	],
	bindings: azureAiFoundryBindings,
} satisfies SourceProviderDefinition
