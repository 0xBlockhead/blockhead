import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { moneroDaemonRpcBindings } from '$/sources/MoneroDaemonRpc/bindings.ts'

export const moneroDaemonRpcOrigins = [
	...new Map(
		moneroDaemonRpcBindings
			.flatMap((binding) => binding.endpoints)
			.flatMap((endpoint) => (
				endpoint.origin == null ?
					[]
				:
					[[
						endpoint.origin,
						{
							origin: endpoint.origin,
							corsEnabled: endpoint.corsEnabled === true,
						},
					]]
			))
	).values(),
]

export const moneroMainnetRpcEndpoints = moneroDaemonRpcBindings
	.flatMap((binding) => binding.endpoints)
	.map((endpoint) => ({
		url: endpoint.locator,
		transportType: TransportType.Http,
		providerName: (
			endpoint.locator.includes('cakewallet') ?
				'Cake Wallet public Monero node'
			: endpoint.locator.includes('hashvault') ?
				'Hashvault public Monero node'
			:
				'Local monerod'
		),
	}))

export default {
	provider: SourceProvider.MoneroDaemonRpc,
	label: 'Monero daemon RPC',
	sources: [
		{
			provider: SourceProvider.MoneroDaemonRpc,
			source: Source.MoneroDaemonRpc_JsonRpc,
			label: 'Monero daemon JSON-RPC',
		},
	],
	bindings: moneroDaemonRpcBindings,
} satisfies SourceProviderDefinition
