// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Onnx/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Onnx,
	label: 'ONNX',
	sources: [
		{
			source: Source.OnnxArtifact_Local,
			label: 'ONNX artifact',
		},
	],
	bindings: [bindings[Source.OnnxArtifact_Local]],
} satisfies SourceProviderDefinition
