import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { leapBindings } from '$/sources/Leap/bindings.ts'

export default {
	provider: SourceProvider.Leap,
	label: 'Leap',
	sources: [
		{
			provider: SourceProvider.Leap,
			source: Source.Leap_WalletApi,
			label: 'Leap wallet API',
		},
	],
	bindings: leapBindings,
} satisfies SourceProviderDefinition
