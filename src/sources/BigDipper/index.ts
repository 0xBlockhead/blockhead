import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { bigDipperBindings } from '$/sources/BigDipper/bindings.ts'

export default {
	provider: SourceProvider.BigDipper,
	label: 'Big Dipper',
	sources: [
		{
			provider: SourceProvider.BigDipper,
			source: Source.BigDipper_Rest,
			label: 'Big Dipper REST',
		},
	],
	bindings: bigDipperBindings,
} satisfies SourceProviderDefinition
