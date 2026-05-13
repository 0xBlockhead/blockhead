export const TelemetryObservationScopeConst = {
	NodeLocal: 'nodeLocal',
	ProviderLocal: 'providerLocal',
	Aggregated: 'aggregated',
} as const satisfies Record<string, string>

export type TelemetryObservationScope =
	(typeof TelemetryObservationScopeConst)[keyof typeof TelemetryObservationScopeConst]
