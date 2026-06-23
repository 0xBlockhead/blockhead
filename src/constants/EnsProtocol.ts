// Constants

export const ensProtocols = [
	{
		scope: '_GlobalEnsNetwork',
		docsUrl: 'https://docs.ens.domains/',
		homeUrl: 'https://ens.domains/',
		protocolName: 'Ethereum Name Service',
		registryLabel: 'L1 name registry + resolver records',
		topology: 'ENS hub -> names / resolver records / timestamp snapshots',
		mainnetChainId: 1,
		registryContractAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
		ethRegistrarControllerAddress: '0x253553366Da8546fC250F225fe3d25d0C782303b',
		reverseRegistrarAddress: '0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7Cb',
		nameWrapperAddress: '0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401',
	},
] as const


// Lookups

export const ensProtocolByScope = Object.fromEntries(
	ensProtocols.map((protocol) => [
		protocol.scope,
		protocol,
	])
)
