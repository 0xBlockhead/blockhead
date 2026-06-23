import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { blockchairBindings } from '$/sources/Blockchair/bindings.ts'

export const blockchairOrigins = blockchairBindings.flatMap((binding) => (
	binding.endpoints.map((endpoint) => ({
		origin: endpoint.origin,
		corsEnabled: endpoint.corsEnabled,
	}))
))

export default {
	provider: SourceProvider.Blockchair,
	label: 'Blockchair',
	sources: [
		{
			provider: SourceProvider.Blockchair,
			source: Source.Blockchair_Rest,
			label: 'Blockchair REST',
		},
	],
	bindings: blockchairBindings,
} satisfies SourceProviderDefinition
