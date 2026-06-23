import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { freighterBindings } from '$/sources/Freighter/bindings.ts'

export default {
	provider: SourceProvider.Freighter,
	label: 'Freighter',
	sources: [
		{
			provider: SourceProvider.Freighter,
			source: Source.Freighter_WalletApi,
			label: 'Freighter wallet API',
		},
	],
	bindings: freighterBindings,
} satisfies SourceProviderDefinition
