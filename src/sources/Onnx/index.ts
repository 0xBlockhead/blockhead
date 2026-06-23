import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { onnxBindings } from '$/sources/Onnx/bindings.ts'

export default {
	provider: SourceProvider.Onnx,
	label: 'ONNX',
	sources: [
		{
			provider: SourceProvider.Onnx,
			source: Source.OnnxArtifact_Local,
			label: 'ONNX artifact',
		},
	],
	bindings: onnxBindings,
} satisfies SourceProviderDefinition
