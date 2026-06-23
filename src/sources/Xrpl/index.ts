import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { xrplBindings } from '$/sources/Xrpl/bindings.ts'

export default {
	provider: SourceProvider.Xrpl,
	label: 'XRPL rippled',
	sources: [
		{
			provider: SourceProvider.Xrpl,
			source: Source.Xrpl_Rippled,
			label: 'XRPL rippled JSON-RPC',
		},
	],
	bindings: xrplBindings,
} satisfies SourceProviderDefinition
