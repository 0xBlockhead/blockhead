import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { pontemBindings } from '$/sources/Pontem/bindings.ts'

export default {
	provider: SourceProvider.Pontem,
	label: 'Pontem',
	sources: [
		{
			provider: SourceProvider.Pontem,
			source: Source.Pontem_WalletApi,
			label: 'Pontem wallet API',
		},
	],
	bindings: pontemBindings,
} satisfies SourceProviderDefinition
