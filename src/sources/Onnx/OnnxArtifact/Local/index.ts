// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const onnxArtifactLocalSourceDefinition = {
	provider: SourceProvider.Onnx,
	source: Source.OnnxArtifact_Local,
	label: 'ONNX artifact',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default onnxArtifactLocalSourceDefinition
