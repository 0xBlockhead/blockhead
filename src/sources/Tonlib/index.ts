import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { tonlibBindings } from '$/sources/Tonlib/bindings.ts'

export default {
	provider: SourceProvider.Tonlib,
	label: 'tonlib',
	sources: [
		{
			provider: SourceProvider.Tonlib,
			source: Source.Tonlib_JsonRpc,
			label: 'tonlib JSON-RPC',
		},
	],
	bindings: tonlibBindings,
} satisfies SourceProviderDefinition
