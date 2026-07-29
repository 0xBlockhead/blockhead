// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Onnx/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Onnx,
	label: 'ONNX',
	sources: [
		{
			source: Source.OnnxArtifact_Local,
			label: 'ONNX artifact',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
