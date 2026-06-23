import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { magnetUriBindings } from '$/sources/MagnetUri/bindings.ts'

export default {
	provider: SourceProvider.MagnetUri,
	label: 'Magnet URI',
	sources: [
		{
			provider: SourceProvider.MagnetUri,
			source: Source.MagnetUri_Uri,
			label: 'Magnet URI parser',
		},
	],
	bindings: magnetUriBindings,
} satisfies SourceProviderDefinition
