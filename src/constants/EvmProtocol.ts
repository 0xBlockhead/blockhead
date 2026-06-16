// Constants

export const evmProtocols = [
	{
		scope: 'EvmProtocol',
		docsUrl: 'https://ethereum.org/en/developers/docs/evm/',
		homeUrl: 'https://ethereum.org/en/developers/docs/',
		protocolName: 'EVM',
		registryLabel: 'Local signature catalogs + OpenChain lookup',
		topology: 'Local catalog -> topics / selectors / errors -> OpenChain detail decode',
	},
] as const


// Lookups

export const evmProtocolByScope = Object.fromEntries(
	evmProtocols.map((protocol) => [
		protocol.scope,
		protocol,
	])
)
