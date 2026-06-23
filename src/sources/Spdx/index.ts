import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { spdxBindings } from '$/sources/Spdx/bindings.ts'

export default {
	provider: SourceProvider.Spdx,
	label: 'SPDX',
	sources: [
		{
			provider: SourceProvider.Spdx,
			source: Source.SpdxDocument_Local,
			label: 'SPDX document',
		},
	],
	bindings: spdxBindings,
} satisfies SourceProviderDefinition
