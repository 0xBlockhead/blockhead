// Constants

export const swarmProtocols = [
	{
		scope: 'SwarmProtocol',
		docsUrl: 'https://docs.ethswarm.org/',
		homeUrl: 'https://www.ethswarm.org/',
		protocolName: 'Swarm',
		registryLabel: 'Bee BZZ content references via public gateways',
		topology: 'Browse BZZ references -> SwarmResource resolver pages',
	},
] as const


// Lookups

export const swarmProtocolByScope = Object.fromEntries(
	swarmProtocols.map((protocol) => [
		protocol.scope,
		protocol,
	])
)
