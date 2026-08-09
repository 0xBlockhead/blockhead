import bindings from '$/sources/BeaconchaIn/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.BeaconchaIn,
	label: 'Beaconcha.in',
	sources: {
		[Source.BeaconchaIn_Rest]: {
			label: 'Beaconcha.in REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
