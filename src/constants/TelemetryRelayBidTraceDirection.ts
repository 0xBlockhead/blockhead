export const TelemetryRelayBidTraceDirectionConst = {
	ProposerPayloadDelivered: 'proposerPayloadDelivered',
	BuilderBlocksReceived: 'builderBlocksReceived',
} as const satisfies Record<string, string>

export type TelemetryRelayBidTraceDirection =
	(typeof TelemetryRelayBidTraceDirectionConst)[keyof typeof TelemetryRelayBidTraceDirectionConst]
