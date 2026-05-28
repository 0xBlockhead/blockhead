// Types
import type { SourceOrigin } from '$/sources/$SourceProvider.ts'


// Constants
export const mevRelayHosts = [
	{
		chainId: 1,
		host: 'boost-relay.flashbots.net',
	},
	{
		chainId: 1,
		host: 'relay.ultrasound.money',
	},
	{
		chainId: 11155111,
		host: 'builder-relay-sepolia.flashbots.net',
	},
] as const satisfies readonly {
	chainId: number
	host: string
}[]


// Lookups
export const mevRelayHttpsOrigins = (
	[...new Set(
		mevRelayHosts.map((row) => (
			`https://${row.host}`
		)),
	)]
		.map((origin) => (
			{
				origin,
				corsEnabled: false as const,
			}
		))
) satisfies readonly SourceOrigin[]
