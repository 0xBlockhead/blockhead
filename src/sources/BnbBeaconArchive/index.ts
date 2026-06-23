import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { bnbBeaconArchiveBindings } from '$/sources/BnbBeaconArchive/bindings.ts'

export default {
	provider: SourceProvider.BnbBeaconArchive,
	label: 'BNB Beacon archive',
	sources: [
		{
			provider: SourceProvider.BnbBeaconArchive,
			source: Source.BnbBeaconArchive_Rest,
			label: 'BNB Beacon archive REST',
		},
	],
	bindings: bnbBeaconArchiveBindings,
} satisfies SourceProviderDefinition
