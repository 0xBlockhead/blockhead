import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { xrplClioBindings } from '$/sources/XrplClio/bindings.ts'

export default {
	provider: SourceProvider.XrplClio,
	label: 'XRPL Clio',
	sources: [
		{
			provider: SourceProvider.XrplClio,
			source: Source.XrplClio_JsonRpc,
			label: 'XRPL Clio JSON-RPC',
		},
	],
	bindings: xrplClioBindings,
} satisfies SourceProviderDefinition
