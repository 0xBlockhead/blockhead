import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { x402Bindings } from '$/sources/X402/bindings.ts'

export default {
	provider: SourceProvider.X402,
	label: 'x402',
	sources: [
		{
			provider: SourceProvider.X402,
			source: Source.X402_Http,
			label: 'x402 HTTP',
		},
	],
	bindings: x402Bindings,
} satisfies SourceProviderDefinition
