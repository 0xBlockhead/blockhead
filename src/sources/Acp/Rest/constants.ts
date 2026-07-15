export const acpRegistryEndpoints = [
	{
		locator: 'https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json',
		origin: 'https://cdn.agentclientprotocol.com',
		corsEnabled: false,
	},
] as const

export const acpRegistryOrigins = acpRegistryEndpoints.map((endpoint) => ({
	origin: endpoint.origin,
	corsEnabled: endpoint.corsEnabled,
}))
