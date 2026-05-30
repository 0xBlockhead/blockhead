import type { SourceOrigin } from '$/sources/$SourceProvider.ts'

export const beaconchaInApiBaseByExecutionChainId = {
	1: 'https://beaconcha.in/api/v1',
	17_000: 'https://holesky.beaconcha.in/api/v1',
	560_048: 'https://hoodi.beaconcha.in/api/v1',
} as const satisfies Record<number, string>

export const beaconchaInOrigins = (
	Object.values(beaconchaInApiBaseByExecutionChainId)
		.map((apiBase) => (
			{
				origin: new URL(apiBase).origin,
				corsEnabled: false,
			}
		))
) satisfies readonly SourceOrigin[]
