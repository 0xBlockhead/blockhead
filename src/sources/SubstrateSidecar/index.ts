import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import SubstrateSidecarRest from '$/sources/SubstrateSidecar/Rest/index.ts'

export default {
	provider: SourceProvider.SubstrateSidecar,
	label: 'Substrate API Sidecar',
	origins: [
		{
			origin: 'http://127.0.0.1:8080',
			corsEnabled: false,
		},
	],
	sources: [
		SubstrateSidecarRest,
	],
} as const satisfies SourceProviderDefinition
