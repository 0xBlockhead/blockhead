// Constants

export const ipfsProtocols = [
	{
		scope: 'IpfsProtocol',
		docsUrl: 'https://docs.ipfs.tech/',
		homeUrl: 'https://ipfs.io/',
		protocolName: 'IPFS',
		registryLabel: 'Content-addressed storage via public gateways',
		topology: 'Browse CIDs / IPNS -> IpfsResource resolver pages',
	},
] as const

export const ipfsPublicGateways = [
	{
		origin: 'https://ipfs.io',
	},
	{
		origin: 'https://gateway.pinata.cloud',
	},
	{
		origin: 'https://cloudflare-ipfs.com',
	},
] as const


// Lookups

export const ipfsProtocolByScope = Object.fromEntries(
	ipfsProtocols.map((protocol) => [
		protocol.scope,
		protocol,
	])
)
