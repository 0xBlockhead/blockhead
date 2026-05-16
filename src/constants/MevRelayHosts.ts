// Types
import type { SourceOrigin } from '$/sources/$SourceProvider.ts'


// Constants
export const mevRelayHostsByChainId = {
	1: [
		'boost-relay.flashbots.net',
		'relay.ultrasound.money',
	] as const,
	11155111: [
		'builder-relay-sepolia.flashbots.net',
	] as const,
} as const satisfies Record<number, readonly string[]>


// Lookups

export const mevRelayHttpsOrigins = (
	[...new Set(
		Object.values(mevRelayHostsByChainId)
			.flat()
			.map((host) => (
				`https://${host}`
			)),
	)]
		.map((origin) => (
			{
				origin,
				corsEnabled: false as const,
			}
		))
) as const satisfies readonly SourceOrigin[]
