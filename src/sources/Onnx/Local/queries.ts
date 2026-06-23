import type { OnnxArtifactSummary } from '$/sources/Onnx/Local/types.ts'

export const summarizeArtifact = (
	bytes: Uint8Array
) => ({
	byteLength: bytes.byteLength,
}) satisfies OnnxArtifactSummary
