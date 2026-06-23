import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { blockfrostBindings } from '$/sources/Blockfrost/bindings.ts'

export default {
	provider: SourceProvider.Blockfrost,
	label: 'Blockfrost',
	sources: [
		{
			provider: SourceProvider.Blockfrost,
			source: Source.Blockfrost_Rest,
			label: 'Blockfrost REST',
		},
	],
	bindings: blockfrostBindings,
} satisfies SourceProviderDefinition
