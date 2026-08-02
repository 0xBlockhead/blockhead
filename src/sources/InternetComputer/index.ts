// Generated from APP.ts.

import bindings from '$/sources/InternetComputer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.InternetComputer,
	label: 'Internet Computer',
	sources: {
		[Source.IcDashboard_Canister]: {
			label: 'IC dashboard canister',
		},
		[Source.InternetComputer_Canister]: {
			label: 'Internet Computer canister',
		},
		[Source.InternetComputer_Http]: {
			label: 'Internet Computer HTTP gateway',
		},
		[Source.InternetComputer_RosettaApi]: {
			label: 'Internet Computer Rosetta API',
		},
		[Source.InternetComputer_WalletApi]: {
			label: 'Internet Computer wallet API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
