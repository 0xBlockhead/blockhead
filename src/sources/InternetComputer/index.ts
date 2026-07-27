// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/InternetComputer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.InternetComputer,
	label: 'Internet Computer',
	sources: [
		{
			source: Source.IcDashboard_Canister,
			label: 'IC dashboard canister',
		},
		{
			source: Source.InternetComputer_Canister,
			label: 'Internet Computer canister',
		},
		{
			source: Source.InternetComputer_Http,
			label: 'Internet Computer HTTP gateway',
		},
		{
			source: Source.InternetComputer_RosettaApi,
			label: 'Internet Computer Rosetta API',
		},
		{
			source: Source.InternetComputer_WalletApi,
			label: 'Internet Computer wallet API',
		},
	],
	bindings: [
		bindings[Source.IcDashboard_Canister],
		bindings[Source.InternetComputer_Canister],
		bindings[Source.InternetComputer_Http],
		bindings[Source.InternetComputer_RosettaApi],
		bindings[Source.InternetComputer_WalletApi],
	],
} satisfies SourceProviderDefinition
