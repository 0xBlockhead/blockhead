import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import BeaconchaInRestSource from '$/sources/BeaconchaIn/Rest/index.ts'
import { beaconchaInOrigins } from '$/sources/BeaconchaIn/Rest/constants.ts'

export default {
	provider: SourceProvider.BeaconchaIn,
	label: 'Beaconcha.in',
	origins: beaconchaInOrigins,
	sources: [
		BeaconchaInRestSource,
	],
} satisfies SourceProviderDefinition
