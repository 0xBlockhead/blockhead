export const arweaveGatewayEndpoints = [
	{
		locator: 'https://arweave.net',
		origin: 'https://arweave.net',
		corsEnabled: true,
	},
	{
		locator: 'https://ar-io.net',
		origin: 'https://ar-io.net',
		corsEnabled: true,
	},
] as const

export const arweaveGatewayOrigins = arweaveGatewayEndpoints.map((endpoint) => ({
	origin: endpoint.origin,
	corsEnabled: endpoint.corsEnabled,
}))
