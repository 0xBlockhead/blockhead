// Constants

export const ensProtocols = [
	{
		scope: 'EnsProtocol',
		docsUrl: 'https://docs.ens.domains/',
		homeUrl: 'https://ens.domains/',
		protocolName: 'Ethereum Name Service',
		registryLabel: 'L1 name registry + resolver records',
		topology: 'Browse/search -> EnsName / EnsSearch detail',
	},
] as const


// Lookups

export const ensProtocolByScope = Object.fromEntries(
	ensProtocols.map((protocol) => [
		protocol.scope,
		protocol,
	])
)
