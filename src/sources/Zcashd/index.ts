import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { zcashdBindings } from '$/sources/Zcashd/bindings.ts'

export default {
	provider: SourceProvider.Zcashd,
	label: 'zcashd',
	sources: [
		{
			provider: SourceProvider.Zcashd,
			source: Source.Zcashd_JsonRpc,
			label: 'zcashd JSON-RPC',
		},
		{
			provider: SourceProvider.Zcashd,
			source: Source.ZcashdWallet_JsonRpc,
			label: 'zcashd wallet JSON-RPC',
		},
	],
	bindings: zcashdBindings,
} satisfies SourceProviderDefinition
