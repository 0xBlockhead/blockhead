// Generated from APP.ts.

import bindings from '$/sources/Onnx/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Onnx,
	label: 'ONNX',
	sources: {
		[Source.OnnxArtifact_Local]: {
			label: 'ONNX artifact',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
